import { type Skill, type Stat } from '@/domain';
import { type Item } from '@/feature/item';

export const computeStat = (
  stat: Stat,
  raceStats: Partial<Record<Skill, number>>,
  items: Record<string, Item | null>,
  itemEffects: Record<Stat, number>,
  implantsEffects: Record<Stat, number>,
  kitsEffects: Record<Stat, number>,
): number => {
  const rightArmPenalty =
    (items['leftArm']?.hands ?? 0) > 1
      ? (items['rightArm']?.effects?.find((val) => val?.property === stat)
          ?.value ?? 0)
      : 0;

  return (
    (raceStats[stat as Skill] ?? 0) +
    implantsEffects[stat] +
    itemEffects[stat] +
    kitsEffects[stat] -
    rightArmPenalty
  );
};
