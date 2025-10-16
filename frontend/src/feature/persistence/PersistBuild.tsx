import { useEffect, useRef } from 'react';

import type { ItemSpot } from '@/domain';
import type { ImplantName } from '@/feature/implant';
import { useImplantsDispatch, useImplantsState } from '@/feature/implant';
import type { Item } from '@/feature/item';
import { useItemsDispatch, useItemsState } from '@/feature/item';
import type { Kit } from '@/feature/kit';
import { useKitsDispatch, useKitsState } from '@/feature/kit';
import type { Gender, RaceType } from '@/feature/profile';
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
      const data = JSON.parse(raw) as Record<string, unknown>;

      const prof = data.profile as Record<string, unknown> | undefined;
      if (prof) {
        const g = prof.gender as string | undefined;
        const r = prof.race as string | undefined;
        if (g) profileDispatch.setGender(g as Gender);
        if (r) profileDispatch.setRace(r as RaceType);
      }

      const imps = data.implants as Record<string, unknown> | undefined;
      if (imps) {
        for (const [name, level] of Object.entries(imps)) {
          const lvl = Number(level as unknown);
          implantsDispatch.setImplant(
            name as ImplantName,
            Number.isFinite(lvl) ? lvl : 0,
          );
        }
      }

      const its = data.items as Record<string, unknown> | undefined;
      if (its) {
        for (const [spot, item] of Object.entries(its)) {
          if (item === null) itemsDispatch.resetItem(spot as ItemSpot);
          else itemsDispatch.setItem(spot as ItemSpot, item as Item);
        }
      }

      const kts = data.kits as Record<string, unknown> | undefined;
      if (kts) {
        for (const [spot, selections] of Object.entries(kts)) {
          if (!Array.isArray(selections)) continue;
          let idx = 0;
          for (const sel of selections as unknown[]) {
            const s = sel as Record<string, unknown>;
            if (!s.kit) continue;
            kitsDispatch.addKit(spot as ItemSpot, s.kit as Kit, true);
            if (s.number) {
              kitsDispatch.setKitNumber(
                spot as ItemSpot,
                idx,
                Number(s.number),
              );
            }
            idx++;
          }
        }
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
