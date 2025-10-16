import { useEffect, useRef } from 'react';

import type { ItemSpot } from '@/domain';
import type { ImplantName } from '@/feature/implant';
import { useImplantsDispatch, useImplantsState } from '@/feature/implant';
import type { Item } from '@/feature/item';
import { useItemsDispatch, useItemsState } from '@/feature/item';
import type { KitSelection } from '@/feature/kit';
import { useKitsDispatch, useKitsState } from '@/feature/kit';
import type { Gender, ProfileState, RaceType } from '@/feature/profile';
import { usePRofileDispatch, useProfileState } from '@/feature/profile';

const STORAGE_KEY = 'dreadcast.build.v1';

export const PersistBuild = () => {
  const profile = useProfileState();
  const profileDispatch = usePRofileDispatch();

  const implants = useImplantsState();
  const implantsDispatch = useImplantsDispatch();

  const items = useItemsState();
  const itemsDispatch = useItemsDispatch();

  const kits = useKitsState();
  const kitsDispatch = useKitsDispatch();

  // Load saved build once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      const prof = data?.profile;
      if (prof?.gender && prof?.race) {
        const newProfile: ProfileState = {
          gender: prof.gender as Gender,
          race: prof.race as RaceType,
        };
        profileDispatch.replaceProfile(newProfile);
      }

      const imps = data?.implants as Record<ImplantName, number>;
      if (imps) {
        implantsDispatch.replaceImplants(imps);
      }

      const its = data?.items as Record<ItemSpot, Item | null>;
      if (its) {
        itemsDispatch.replaceItems(its);
      }

      const kts = data?.kits as Record<ItemSpot, KitSelection[]>;
      if (kts) {
        kitsDispatch.replaceKits(kts);
      }
    } catch (e) {
      // ignore malformed data
      // eslint-disable-next-line no-console
      console.warn('Failed to restore build from localStorage', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (debounced)
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        const snapshot = {
          profile,
          implants,
          items,
          kits,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to save build to localStorage', e);
      }
    }, 250);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [profile, implants, items, kits]);

  return null;
};

export default PersistBuild;
