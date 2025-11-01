import { type Skill, type Stat } from '@/domain';
import { type Item } from '@/feature/item';

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
): number => {
  return (
    (raceStats[stat as Skill] ?? 0) +
    implantsEffects[stat] +
    itemEffects[stat] +
    kitsEffects[stat] -
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
