import { StatValues, type Skill, type Stat } from '@/domain';
import { computeDrugEffects, type Drug } from '@/feature/drug';
import { computeImplantsEffects, type Implant } from '@/feature/implant';
import type { Item, ItemsState } from '@/feature/item';
// Direct import: the item UI imports @/feature/suit, the barrel would cycle.
import { computeItemsEffect } from '@/feature/item/model/item.rules';
import { computeTotalEffects, type KitsState } from '@/feature/kit';

const ARM_SPOTS = {
  LEFT: 'leftArm',
  RIGHT: 'rightArm',
} as const;

/**
 * Calculates the right arm penalty for two-handed weapons
 */
const computeRightArmPenalty = (
  items: Record<string, Item | null>,
  stat: Stat,
): number => {
  const hasOffhand = (items[ARM_SPOTS.LEFT]?.hands ?? 0) > 1;
  if (!hasOffhand) return 0;

  return (
    items[ARM_SPOTS.RIGHT]?.effects?.find((val) => val?.property === stat)
      ?.value ?? 0
  );
};

/**
 * Computes the final value for a given stat, taking into account all effects and penalties
 */
export const computeStat = (
  stat: Stat,
  raceStats: Partial<Record<Skill, number>>,
  items: Record<string, Item | null>,
  itemEffects: Record<Stat, number>,
  implantsEffects: Record<Stat, number>,
  kitsEffects: Record<Stat, number>,
  drugsEffects: Record<Stat, number>,
): number => {
  return (
    (raceStats[stat as Skill] ?? 0) +
    implantsEffects[stat] +
    itemEffects[stat] +
    kitsEffects[stat] +
    drugsEffects[stat] -
    computeRightArmPenalty(items, stat)
  );
};

export const computeStatWithoutItems = (
  stat: Stat,
  raceStats: Partial<Record<Skill, number>>,
  implantsEffects: Record<Stat, number>,
): number => {
  return (raceStats[stat as Skill] ?? 0) + implantsEffects[stat];
};

/**
 * Base health and stamina of every character, added on top of the race.
 */
export const BASE_HEALTH_STAMINA = 116;

export interface SuitStatsInput {
  raceStats: Partial<Record<Stat, number>> | undefined;
  items: ItemsState;
  kits: KitsState;
  implants: Record<string, number>;
  allImplants: Implant[] | undefined;
  drug: Drug | undefined;
}

/**
 * Final stats of a build, without any store. Same result as useSuitSelector.
 */
export const computeSuitStats = ({
  raceStats,
  items,
  kits,
  implants,
  allImplants,
  drug,
}: SuitStatsInput): Record<Stat, number> => {
  const itemEffects = computeItemsEffect(items);
  const implantsEffects = computeImplantsEffects(implants, allImplants);
  const kitsEffects = computeTotalEffects(kits);
  const drugEffects = computeDrugEffects(drug);

  return Object.keys(StatValues).reduce(
    (acc, s) => {
      const stat = s as Stat;
      acc[stat] = computeStat(
        stat,
        raceStats ?? {},
        items,
        itemEffects,
        implantsEffects,
        kitsEffects,
        drugEffects,
      );
      if (stat === 'health' || stat === 'stamina') {
        acc[stat] += BASE_HEALTH_STAMINA;
      }
      return acc;
    },
    {} as Record<Stat, number>,
  );
};
