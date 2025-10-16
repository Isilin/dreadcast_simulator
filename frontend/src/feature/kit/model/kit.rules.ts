import { type KitSelection } from './kit.types';

import {
  ItemSpotValue,
  StatValues,
  type ItemSpot,
  type Stat,
  type StatModifier,
} from '@/domain';

export const computeSpotTechCost = (kits: KitSelection[]): number => {
  return kits.reduce(
    (acc: number, curr: KitSelection) => acc + curr.kit.tech * curr.number,
    0,
  );
};

export const computeSpotTotalEffect = (
  kits: KitSelection[],
): Record<Stat, number> => {
  const base = Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;

  kits.forEach((kit: KitSelection) =>
    kit.kit.effects.forEach(
      (effect: StatModifier) =>
        (base[effect.property] += effect.value * kit.number),
    ),
  );

  return base;
};

export const computeTotalEffects = (
  kits: Record<ItemSpot, KitSelection[]>,
): Record<Stat, number> => {
  const base = Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;

  ItemSpotValue.forEach((spot) =>
    kits[spot].forEach((kit: KitSelection) =>
      kit.kit.effects.forEach(
        (effect: StatModifier) =>
          (base[effect.property] += effect.value * kit.number),
      ),
    ),
  );

  return base;
};
