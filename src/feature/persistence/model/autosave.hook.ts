import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';

import { areBuildsEqual } from './persistence.selectors';
import {
  createBuildSnapshot,
  readBuildStoreState,
} from './persistence.snapshot';
import { upsertRemoteBuild } from '../services/persistence.remote';
import {
  GUEST_SLOTS,
  type BuildPersistencePolicy,
  type BuildSnapshot,
  readBuilds,
  writeBuilds,
} from '../services/persistence.service';

import { useDrugStore } from '@/feature/drug/model/drug.store';
import { useImplantStore } from '@/feature/implant/model/implant.store';
import { useItemStore } from '@/feature/item/model/item.store';
import { useKitStore } from '@/feature/kit/model/kit.store';
import { useProfileStore } from '@/feature/profile/model/profile.store';

interface CurrentRef<T> {
  current: T;
}

interface UseAutosaveParams {
  activeRef: CurrentRef<string>;
  buildsRef: CurrentRef<Record<string, BuildSnapshot>>;
  isLoadingBuildsRef: CurrentRef<boolean>;
  isRestoringRef: CurrentRef<boolean>;
  policyRef: CurrentRef<BuildPersistencePolicy>;
  setBuilds: Dispatch<SetStateAction<Record<string, BuildSnapshot>>>;
}

export const useBuildAutosave = ({
  activeRef,
  buildsRef,
  isLoadingBuildsRef,
  isRestoringRef,
  policyRef,
  setBuilds,
}: UseAutosaveParams): void => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const doSave = () => {
      if (isRestoringRef.current || isLoadingBuildsRef.current) {
        return;
      }

      const currentSlot = activeRef.current;
      const candidateBuild = createBuildSnapshot(
        currentSlot,
        readBuildStoreState(),
        buildsRef.current[currentSlot],
      );

      const previousBuild = buildsRef.current[currentSlot];
      if (areBuildsEqual(previousBuild, candidateBuild)) {
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
  }, [
    activeRef,
    buildsRef,
    isLoadingBuildsRef,
    isRestoringRef,
    policyRef,
    setBuilds,
  ]);
};
