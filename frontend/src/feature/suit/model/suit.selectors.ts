import { useMemo } from 'react';

import { computeStat } from './suit.rules';

import { StatValues, type Stat } from '@/domain';
import { useImplantsEffects } from '@/feature/implant';
import { useItemsEffect, useItemsState } from '@/feature/item';
import { useKitsEffects } from '@/feature/kit';
import { useRaceStats } from '@/feature/profile';

export const useSuitSelector = () => {
  const raceStats = useRaceStats();
  const items = useItemsState();
  const itemEffects = useItemsEffect();
  const implantsEffects = useImplantsEffects();
  const kitsEffects = useKitsEffects();

  const stats = useMemo(
    () =>
      Object.keys(StatValues).reduce(
        (acc, s) => {
          const stat = s as Stat;
          acc[stat] = computeStat(
            stat,
            raceStats || {},
            items,
            itemEffects,
            implantsEffects,
            kitsEffects,
          );
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [implantsEffects, itemEffects, items, kitsEffects, raceStats],
  );

  return stats;
};
