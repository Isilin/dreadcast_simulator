import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';

import { StatValues, type Skill, type Stat } from '@/domain';
import { useImplantsEffects } from '@/feature/implant';
import { useItemsEffect, useItemsState } from '@/feature/item';
import { useKitsEffects } from '@/feature/kit';
import { useRaceStats } from '@/feature/profile';

interface SuitSelectors {
  strength: number;
  agility: number;
  robustness: number;
  perception: number;
  stealth: number;
  computing: number;
  medicine: number;
  engineering: number;
  health: number;
  stamina: number;
  speed: number;
  raceDamage: number;
  hitRating: number;
  teamHeal: number;
  cacDamage: number;
  criticalCacChance: number;
  criticalCacDamage: number;
  hitDamages: number;
  criticalHitDamage: number;
}

type SuitContextValues = SuitSelectors;

const SuitContext = createContext<SuitContextValues | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSuitContext = () => {
  const ctx = useContext(SuitContext);
  if (!ctx) throw new Error('SuitContext missing provider');
  return ctx;
};

interface ProviderProps {}

export const SuitProvider = ({
  children,
}: PropsWithChildren<ProviderProps>) => {
  const raceStats = useRaceStats();

  const items = useItemsState();

  const itemEffects = useItemsEffect();
  const implantsEffects = useImplantsEffects();
  const kitsEffects = useKitsEffects();

  const getStat = useCallback(
    (stat: Stat) => {
      return (
        (raceStats?.[stat as Skill] || 0) +
        implantsEffects[stat] +
        itemEffects[stat] +
        kitsEffects[stat] -
        (items['leftArm']?.hands && items['leftArm']?.hands > 1
          ? items['rightArm']?.effects?.find((val) => val?.property === stat)
              ?.value || 0
          : 0)
      );
    },
    [implantsEffects, itemEffects, items, kitsEffects, raceStats],
  );
  const stats = useMemo(
    () =>
      Object.keys(StatValues).reduce(
        (acc, s) => {
          acc[s as Stat] = getStat(s as Stat);
          return acc;
        },
        {} as Record<Stat, number>,
      ),
    [getStat],
  );

  return <SuitContext.Provider value={stats}>{children}</SuitContext.Provider>;
};
