import { useEffect, useMemo, useRef, useState } from 'react';

import {
  fetchRemoteBuilds,
  upsertRemoteBuild,
} from '../services/persistence.remote';
import type {
  BuildSnapshot,
  BuildStorageMode,
} from '../services/persistence.service';
import {
  AUTHENTICATED_FREE_SLOTS,
  GUEST_SLOTS,
  clearLocalBuilds,
  readBuilds,
  resolveBuildPersistencePolicy,
  restoreItems,
  restoreKits,
  serializeItems,
  serializeKits,
  writeBuilds,
} from '../services/persistence.service';

import { useAuthState } from '@/feature/auth';
import {
  useDrugStore,
  initialState as drugsInitialState,
} from '@/feature/drug/model/drug.store';
import {
  useImplantStore,
  initialState as implantsInitialState,
} from '@/feature/implant/model/implant.store';
import type { Item } from '@/feature/item';
import {
  useItemStore,
  initialState as itemsInitialState,
} from '@/feature/item/model/item.store';
import type { Kit } from '@/feature/kit';
import {
  useKitStore,
  initialState as kitsInitialState,
} from '@/feature/kit/model/kit.store';
import {
  useProfileStore,
  initialState as profileInitialState,
} from '@/feature/profile/model/profile.store';
import { useSubscriptions } from '@/feature/subscription';

interface HookParams {
  allItems: Item[] | undefined;
  allKits: Kit[] | undefined;
}

const nowHasValidSubscription = (
  subscriptions: Array<{ status: 'pending' | 'validated'; endsAt: string }>,
) => {
  const now = Date.now();

  return subscriptions.some((subscription) => {
    if (subscription.status !== 'validated') {
      return false;
    }

    const endTimestamp = new Date(subscription.endsAt).getTime();
    return Number.isFinite(endTimestamp) && endTimestamp >= now;
  });
};

const toComparableBuild = (build: BuildSnapshot | null | undefined) => {
  if (!build) {
    return null;
  }

  return JSON.stringify({
    profile: build.profile,
    implants: build.implants,
    items: build.items,
    kits: build.kits,
    drug: build.drug,
  });
};

export function useBuildPersistence({ allItems, allKits }: HookParams) {
  const { session } = useAuthState();
  const isAuthenticated = Boolean(session?.user);
  const [active, setActive] = useState<string>('1');
  const [builds, setBuilds] = useState<Record<string, BuildSnapshot>>({});
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(true);

  const { data: subscriptions = [] } = useSubscriptions({
    enabled: isAuthenticated,
  });

  const hasValidSubscription = useMemo(
    () => nowHasValidSubscription(subscriptions),
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
  const timerRef = useRef<number | null>(null);
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

      if (currentMode === 'local') {
        // Déconnexion : sauvegarder le slot 1 distant en mémoire → localStorage
        if (prevMode === 'remote') {
          const inMemorySlot1 = buildsRef.current['1'];
          if (inMemorySlot1) {
            writeBuilds({ ...readBuilds(), '1': inMemorySlot1 });
          }
        }

        const guestBuild = readBuilds()['1'];
        if (!cancelled) {
          setBuilds(guestBuild ? { '1': guestBuild } : {});
          setIsLoadingBuilds(false);
        }
        return;
      }

      // Mode distant (connecté)
      try {
        const remoteBuilds = await fetchRemoteBuilds();

        // Connexion : si slot 1 distant vide et build local existant → migration silencieuse
        const localBuild = readBuilds()['1'];
        if (!remoteBuilds['1'] && localBuild) {
          try {
            const migrated = await upsertRemoteBuild({
              slot: '1',
              snapshot: localBuild,
            });
            if (!cancelled) {
              remoteBuilds['1'] = migrated;
            }
          } catch {
            // Migration non bloquante
          }
        }

        // Supprimer le localStorage quand on bascule en mode distant
        clearLocalBuilds();

        if (!cancelled) {
          setBuilds(remoteBuilds);
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
    if (persistencePolicy.mode === 'local') {
      return ['1'];
    }

    if (!persistencePolicy.hasUnlimitedSlots) {
      return Array.from({ length: AUTHENTICATED_FREE_SLOTS }, (_, index) =>
        String(index + 1),
      );
    }

    const existingSlotNumbers = Object.keys(builds)
      .map((slot) => Number.parseInt(slot, 10))
      .filter((slot) => Number.isInteger(slot) && slot > 0);
    const maxExistingSlot =
      existingSlotNumbers.length > 0 ? Math.max(...existingSlotNumbers) : 0;
    const totalVisibleSlots = Math.max(
      AUTHENTICATED_FREE_SLOTS,
      maxExistingSlot + 1,
    );

    return Array.from({ length: totalVisibleSlots }, (_, index) =>
      String(index + 1),
    );
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
      useProfileStore.getState().replaceProfile(build.profile);
      useImplantStore.getState().replaceImplants(build.implants);
      useItemStore.getState().replaceItems(restoreItems(build.items, allItems));
      useKitStore.getState().replaceKits(restoreKits(build.kits, allKits));
      useDrugStore.getState().replaceDrug(build.drug ?? drugsInitialState);
    } else {
      useProfileStore.getState().replaceProfile(profileInitialState);
      useImplantStore.getState().replaceImplants(implantsInitialState);
      useItemStore.getState().replaceItems(itemsInitialState);
      useKitStore.getState().replaceKits(kitsInitialState);
      useDrugStore.getState().replaceDrug(drugsInitialState);
    }

    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [active, allItems, allKits, builds, isLoadingBuilds]);

  useEffect(() => {
    const doSave = () => {
      if (isRestoringRef.current || isLoadingBuildsRef.current) {
        return;
      }

      const profile = useProfileStore.getState().profile;
      const implants = useImplantStore.getState().implants;
      const items = useItemStore.getState().items;
      const kits = useKitStore.getState().kits;
      const drug = useDrugStore.getState().drug;
      const currentSlot = activeRef.current;
      const serializedItems = serializeItems(items);
      const serializedKits = serializeKits(kits);

      const candidateBuild: BuildSnapshot = {
        profile,
        implants,
        items: serializedItems,
        kits: serializedKits,
        drug,
        savedAt: Date.now(),
      };

      const previousBuild = buildsRef.current[currentSlot];
      if (
        toComparableBuild(previousBuild) === toComparableBuild(candidateBuild)
      ) {
        return;
      }

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        const currentPolicy = policyRef.current;

        if (currentPolicy.mode === 'local') {
          const guestSlot = String(GUEST_SLOTS);
          const nextLocalBuilds = {
            ...readBuilds(),
            [guestSlot]: candidateBuild,
          };
          writeBuilds(nextLocalBuilds);
          setBuilds({
            [guestSlot]: candidateBuild,
          });
          return;
        }

        void upsertRemoteBuild({
          slot: currentSlot,
          snapshot: candidateBuild,
        })
          .then((savedBuild) => {
            setBuilds((previousBuilds) => ({
              ...previousBuilds,
              [currentSlot]: savedBuild,
            }));
          })
          .catch(() => {
            // On conserve l'etat local memoire pour ne pas bloquer l'edition en cas d'erreur reseau.
            setBuilds((previousBuilds) => ({
              ...previousBuilds,
              [currentSlot]: candidateBuild,
            }));
          });
      }, 250);
    };

    const unsubscribers = [
      useProfileStore.subscribe(doSave),
      useImplantStore.subscribe(doSave),
      useItemStore.subscribe(doSave),
      useKitStore.subscribe(doSave),
      useDrugStore.subscribe(doSave),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    active,
    setActive,
    builds,
    slots,
    maxVisibleSlots: persistencePolicy.visibleSlotCount,
    hasUnlimitedSlots: persistencePolicy.hasUnlimitedSlots,
    storageMode: persistencePolicy.mode,
  };
}
