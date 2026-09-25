import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBuildAutosave } from './autosave.hook';
import { loadBuilds as loadAvailableBuilds } from './persistence.loader';
import {
  getBuildNameForSlot,
  getBuildSlots,
  resolveInitialSlot,
} from './persistence.selectors';
import {
  createBuildSnapshot,
  readBuildStoreState,
  resetBuildStores,
  restoreBuildToStores,
} from './persistence.snapshot';
import {
  deleteRemoteBuild,
  fetchRemoteBuilds,
  upsertRemoteBuild,
} from '../services/persistence.remote';
import {
  GUEST_SLOTS,
  getDefaultBuildName,
  readBuilds,
  readLastActiveSlot,
  resolveBuildPersistencePolicy,
  writeBuilds,
  writeLastActiveSlot,
} from '../services/persistence.service';
import type {
  BuildSnapshot,
  BuildStorageMode,
} from '../services/persistence.service';

import { useAuthState } from '@/feature/auth';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';
import { useActiveSubscription } from '@/feature/subscription';

interface HookParams {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
  /** Slot to open first (e.g. a build just copied from the Communauté). */
  initialSlot?: number;
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
  /**
   * Saves the active build immediately (bypassing the autosave debounce) and
   * resolves once it is persisted. Used before publishing to the Communauté.
   */
  saveActiveBuildNow: () => Promise<BuildSnapshot>;
  /**
   * Deletes the build of the active slot: the next builds move up one slot.
   * Guests get an empty build back.
   */
  deleteActiveBuild: () => Promise<void>;
}

export function useBuildPersistence({
  allItems,
  allKits,
  initialSlot,
}: HookParams): BuildPersistenceState {
  const { session } = useAuthState();
  const isAuthenticated = Boolean(session?.user);
  const [active, setActive] = useState<string>(() =>
    resolveInitialSlot(initialSlot, readLastActiveSlot()),
  );
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(true);

  const {
    isSubscriber: hasValidSubscription,
    isLoading: isSubscriptionLoading,
  } = useActiveSubscription();

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
    // Wait for auth, subscription and builds: until then the slot list is the
    // free-plan one and would wrongly reset a remembered or copied slot.
    if (isLoadingBuilds || isSubscriptionLoading) {
      return;
    }

    if (slots.length === 0 || slots.includes(active)) {
      writeLastActiveSlot(active);
      return;
    }

    setActive(slots[0] ?? String(GUEST_SLOTS));
  }, [active, isLoadingBuilds, isSubscriptionLoading, slots]);

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

  const { cancelPendingSave } = useBuildAutosave({
    activeRef,
    buildsRef,
    isLoadingBuildsRef,
    isRestoringRef,
    policyRef,
    setBuilds,
  });

  const saveActiveBuildNow = useCallback(async (): Promise<BuildSnapshot> => {
    const slot = activeRef.current;
    const candidateBuild = createBuildSnapshot(
      slot,
      readBuildStoreState(),
      buildsRef.current[slot],
    );

    // Same state as the debounced save: drop it and save synchronously.
    cancelPendingSave();

    if (policyRef.current.mode === 'local') {
      const guestSlot = String(GUEST_SLOTS);
      writeBuilds({ ...readBuilds(), [guestSlot]: candidateBuild });
      setBuilds({ [guestSlot]: candidateBuild });
      return candidateBuild;
    }

    const savedBuild = await upsertRemoteBuild({
      slot,
      snapshot: candidateBuild,
    });
    setBuilds((previousBuilds) => ({ ...previousBuilds, [slot]: savedBuild }));
    return savedBuild;
  }, [cancelPendingSave]);

  const deleteActiveBuild = useCallback(async (): Promise<void> => {
    const slot = activeRef.current;

    // An autosave of the build being deleted would recreate it.
    cancelPendingSave();
    isRestoringRef.current = true;

    try {
      if (policyRef.current.mode === 'local') {
        const remainingBuilds = { ...readBuilds() };
        delete remainingBuilds[String(GUEST_SLOTS)];
        writeBuilds(remainingBuilds);
        setBuilds({});
        return;
      }

      await deleteRemoteBuild(slot);
      const remainingBuilds = await fetchRemoteBuilds();
      setBuilds(remainingBuilds);

      // The last build is gone: show the one before instead of an empty slot.
      const slotNumber = Number.parseInt(slot, 10);
      if (!remainingBuilds[slot] && slotNumber > 1) {
        setActive(String(slotNumber - 1));
      }
    } finally {
      isRestoringRef.current = false;
    }
  }, [cancelPendingSave]);

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
    saveActiveBuildNow,
    deleteActiveBuild,
  };
}
