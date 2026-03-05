import { useMemo } from 'react';

import { computeStat, computeStatWithoutItems } from './suit.rules';

import { StatValues, type Stat } from '@/domain';
import { useDrugsEffects } from '@/feature/drug';
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
  const drugsEffects = useDrugsEffects();

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
            drugsEffects,
          );
          if (stat === 'health' || stat === 'stamina') acc[stat] += 116; // Base health and stamina
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [drugsEffects, implantsEffects, itemEffects, items, kitsEffects, raceStats],
  );

  return stats;
};

export const usePureStatSelector = () => {
  const raceStats = useRaceStats();
  const implantsEffects = useImplantsEffects();

  const stats = useMemo(
    () =>
      Object.keys(StatValues).reduce(
        (acc, s) => {
          const stat = s as Stat;
          acc[stat] = computeStatWithoutItems(
            stat,
            raceStats || {},
            implantsEffects,
          );
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [implantsEffects, raceStats],
  );

  return stats;
};
