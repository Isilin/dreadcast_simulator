import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

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

export interface BuildAutosave {
  /** Runs the debounced save now, if any. */
  flushPendingSave: () => Promise<void>;
  /** Drops the debounced save (the caller saves the same state itself). */
  cancelPendingSave: () => void;
}

const AUTOSAVE_DELAY_MS = 250;

export const useBuildAutosave = ({
  activeRef,
  buildsRef,
  isLoadingBuildsRef,
  isRestoringRef,
  policyRef,
  setBuilds,
}: UseAutosaveParams): BuildAutosave => {
  const timerRef = useRef<number | null>(null);
  const pendingSaveRef = useRef<(() => Promise<void>) | null>(null);

  const cancelPendingSave = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingSaveRef.current = null;
  }, []);

  const flushPendingSave = useCallback(async () => {
    const pendingSave = pendingSaveRef.current;
    cancelPendingSave();
    if (pendingSave) {
      await pendingSave();
    }
  }, [cancelPendingSave]);

  useEffect(() => {
    const saveBuild = async (
      currentSlot: string,
      candidateBuild: BuildSnapshot,
    ): Promise<void> => {
      const currentPolicy = policyRef.current;

      if (currentPolicy.mode === 'local') {
        const guestSlot = String(GUEST_SLOTS);
        writeBuilds({
          ...readBuilds(),
          [guestSlot]: candidateBuild,
        });
        setBuilds({
          [guestSlot]: candidateBuild,
        });
        return;
      }

      try {
        const savedBuild = await upsertRemoteBuild({
          slot: currentSlot,
          snapshot: candidateBuild,
        });
        setBuilds((previousBuilds) => ({
          ...previousBuilds,
          [currentSlot]: savedBuild,
        }));
      } catch {
        setBuilds((previousBuilds) => ({
          ...previousBuilds,
          [currentSlot]: candidateBuild,
        }));
      }
    };

    const scheduleSave = () => {
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

      cancelPendingSave();
      pendingSaveRef.current = () => saveBuild(currentSlot, candidateBuild);
      timerRef.current = window.setTimeout(() => {
        void flushPendingSave();
      }, AUTOSAVE_DELAY_MS);
    };

    const unsubscribers = [
      useProfileStore.subscribe(scheduleSave),
      useImplantStore.subscribe(scheduleSave),
      useItemStore.subscribe(scheduleSave),
      useKitStore.subscribe(scheduleSave),
      useDrugStore.subscribe(scheduleSave),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      // Leaving the workbench (e.g. to the Communauté) must not drop an edit
      // made during the debounce window.
      void flushPendingSave();
    };
  }, [
    activeRef,
    buildsRef,
    cancelPendingSave,
    flushPendingSave,
    isLoadingBuildsRef,
    isRestoringRef,
    policyRef,
    setBuilds,
  ]);

  return { flushPendingSave, cancelPendingSave };
};
