import type { StatModifier } from '@/domain';
import type { Item } from '@/feature/item';
import type { KitSelection } from '@/feature/kit';
import { sumStatModifiers } from '@/utils/stats';

/**
 * Total effects of an equipment slot: the item's own effects plus every
 * installed kit copy.
 */
export const computeSlotEffects = (
  item: Item | null,
  kits: KitSelection[],
): StatModifier[] => {
  if (!item) return [];

  return sumStatModifiers([
    ...(item.effects ?? []),
    ...kits.flatMap(({ kit, number }) =>
      kit.effects.map(({ property, value }) => ({
        property,
        value: value * number,
      })),
    ),
  ]);
};
