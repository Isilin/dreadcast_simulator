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
