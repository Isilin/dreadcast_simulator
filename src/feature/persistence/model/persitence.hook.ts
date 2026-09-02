import { useEffect, useMemo, useRef, useState } from 'react';

import { useBuildAutosave } from './autosave.hook';
import { loadBuilds as loadAvailableBuilds } from './persistence.loader';
import {
  getBuildNameForSlot,
  getBuildSlots,
  hasValidSubscription as hasCurrentSubscription,
} from './persistence.selectors';
import {
  createBuildSnapshot,
  readBuildStoreState,
  resetBuildStores,
  restoreBuildToStores,
} from './persistence.snapshot';
import { upsertRemoteBuild } from '../services/persistence.remote';
import {
  GUEST_SLOTS,
  getDefaultBuildName,
  readBuilds,
  resolveBuildPersistencePolicy,
  writeBuilds,
} from '../services/persistence.service';
import type {
  BuildSnapshot,
  BuildStorageMode,
} from '../services/persistence.service';

import { useAuthState } from '@/feature/auth';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';
import { useSubscriptions } from '@/feature/subscription';

interface HookParams {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
}

export interface BuildPersistenceState {
  active: string;
  setActive: (slot: string) => void;
  builds: Record<string, BuildSnapshot>;
  slots: string[];
  maxVisibleSlots: number;
  hasUnlimitedSlots: boolean;
  storageMode: BuildStorageMode;
  getBuildName: (slot: string) => string;
  setActiveBuildName: (name: string) => void;
}

export function useBuildPersistence({
  allItems,
  allKits,
}: HookParams): BuildPersistenceState {
  const { session } = useAuthState();
  const isAuthenticated = Boolean(session?.user);
  const [active, setActive] = useState<string>('1');
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(true);

  const { data: subscriptions = [] } = useSubscriptions({
    enabled: isAuthenticated,
  });

  const hasValidSubscription = useMemo(
    () => hasCurrentSubscription(subscriptions),
    [subscriptions],
  );

  const persistencePolicy = useMemo(
    () =>
      resolveBuildPersistencePolicy({
        isAuthenticated,
        hasValidSubscription,
      }),
    [hasValidSubscription, isAuthenticated],
  );

  const isRestoringRef = useRef(false);
  const activeRef = useRef(active);
  const buildsRef = useRef(builds);
  const policyRef = useRef(persistencePolicy);
  const isLoadingBuildsRef = useRef(isLoadingBuilds);
  const prevModeRef = useRef<BuildStorageMode | null>(null);

  activeRef.current = active;
  buildsRef.current = builds;
  policyRef.current = persistencePolicy;
  isLoadingBuildsRef.current = isLoadingBuilds;

  useEffect(() => {
    let cancelled = false;
    const currentMode = persistencePolicy.mode;
    const prevMode = prevModeRef.current;
    prevModeRef.current = currentMode;

    const loadBuilds = async () => {
      setIsLoadingBuilds(true);
      try {
        const loadedBuilds = await loadAvailableBuilds({
          mode: currentMode,
          previousMode: prevMode,
          inMemorySlot1:
            prevMode === 'remote' ? buildsRef.current['1'] : undefined,
        });

        if (!cancelled) {
          setBuilds(loadedBuilds);
        }
      } catch {
        if (!cancelled) {
          setBuilds({});
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBuilds(false);
        }
      }
    };

    void loadBuilds();

    return () => {
      cancelled = true;
    };
  }, [persistencePolicy.mode, session?.user?.id]);

  const slots = useMemo(() => {
    return getBuildSlots({
      mode: persistencePolicy.mode,
      hasUnlimitedSlots: persistencePolicy.hasUnlimitedSlots,
      builds,
    });
  }, [builds, persistencePolicy.hasUnlimitedSlots, persistencePolicy.mode]);

  useEffect(() => {
    if (slots.length === 0 || slots.includes(active)) {
      return;
    }

    setActive(slots[0] ?? String(GUEST_SLOTS));
  }, [active, slots]);

  useEffect(() => {
    if (!allItems || !allKits || isLoadingBuilds) {
      return;
    }

    isRestoringRef.current = true;
    const build = builds[active];

    if (build) {
      restoreBuildToStores(build, allItems, allKits);
    } else {
      resetBuildStores();
    }

    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [active, allItems, allKits, builds, isLoadingBuilds]);

  const buildSnapshotFromStores = (slot: string): BuildSnapshot => {
    return createBuildSnapshot(
      slot,
      readBuildStoreState(),
      buildsRef.current[slot],
    );
  };

  const getBuildName = (slot: string): string => {
    return getBuildNameForSlot(builds, slot);
  };

  const setActiveBuildName = (name: string) => {
    if (isLoadingBuildsRef.current) {
      return;
    }

    const slot = activeRef.current;
    const normalizedName = name.trim();
    const nextName =
      normalizedName.length > 0 ? normalizedName : getDefaultBuildName(slot);
    const candidateBuild = {
      ...buildSnapshotFromStores(slot),
      name: nextName,
    };

    setBuilds((previousBuilds) => ({
      ...previousBuilds,
      [slot]: candidateBuild,
    }));

    if (policyRef.current.mode === 'local') {
      const guestSlot = String(GUEST_SLOTS);
      writeBuilds({
        ...readBuilds(),
        [guestSlot]: candidateBuild,
      });
      return;
    }

    void upsertRemoteBuild({
      slot,
      snapshot: candidateBuild,
    }).catch(() => {
      // On garde la mise a jour locale en memoire si la sauvegarde reseau echoue.
    });
  };

  useBuildAutosave({
    activeRef,
    buildsRef,
    isLoadingBuildsRef,
    isRestoringRef,
    policyRef,
    setBuilds,
  });

  return {
    active,
    setActive,
    builds,
    slots,
    maxVisibleSlots: persistencePolicy.visibleSlotCount,
    hasUnlimitedSlots: persistencePolicy.hasUnlimitedSlots,
    storageMode: persistencePolicy.mode,
    getBuildName,
    setActiveBuildName,
  };
}
