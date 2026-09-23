import { type KitSelection } from './kit.types';

import {
  ItemSpotValue,
  type ItemSpot,
  type Stat,
  type StatModifier,
} from '@/domain';
import { createEmptyStats } from '@/utils/stats';

/**
 * Computes the total tech cost for a list of kits
 */
export const computeSpotTechCost = (kits: KitSelection[]): number => {
  return kits.reduce(
    (acc: number, curr: KitSelection) => acc + curr.kit.tech * curr.number,
    0,
  );
};

/**
 * Accumulates effects from kits into a stats object
 */
const accumulateKitEffects = (
  stats: Record<Stat, number>,
  kit: KitSelection,
): void => {
  kit.kit.effects.forEach(
    (effect: StatModifier) =>
      (stats[effect.property] += effect.value * kit.number),
  );
};

/**
 * Computes the total effects for a list of kits
 */
export const computeSpotTotalEffect = (
  kits: KitSelection[],
): Record<Stat, number> => {
  const stats = createEmptyStats();
  kits.forEach((kit) => accumulateKitEffects(stats, kit));
  return stats;
};

/**
 * Computes the total effects for all kits across all spots
 */
export const computeTotalEffects = (
  kits: Record<ItemSpot, KitSelection[]>,
): Record<Stat, number> => {
  const stats = createEmptyStats();
  ItemSpotValue.forEach((spot) =>
    kits[spot].forEach((kit) => accumulateKitEffects(stats, kit)),
  );
  return stats;
};

/** State of the tech budget of an equipment slot. */
export type TechBudgetStatus = 'over' | 'full' | 'low' | 'spare';

/** Tech points above which unused room is flagged as spare. */
export const SPARE_TECH_THRESHOLD = 40;

/**
 * Tech points left on an item once its kits are installed (negative when the
 * kits cost more than the item allows).
 */
export const computeRemainingTech = (
  itemTech: number,
  kits: KitSelection[],
): number => itemTech - computeSpotTechCost(kits);

export const getTechBudgetStatus = (remaining: number): TechBudgetStatus => {
  if (remaining < 0) return 'over';
  if (remaining === 0) return 'full';
  if (remaining > SPARE_TECH_THRESHOLD) return 'spare';
  return 'low';
};
