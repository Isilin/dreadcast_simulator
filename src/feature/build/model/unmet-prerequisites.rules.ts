import { ItemSpotValue, type ItemSpot } from '@/domain';
import {
  isTwoHandedOffhand,
  type ItemsState,
} from '@/feature/item';
import type { KitsState } from '@/feature/kit';
import {
  findUnmetPrerequisites,
  type Prerequisite,
  type PrerequisiteContext,
} from '@/feature/prerequisite';

export interface UnmetPrerequisitesEntry {
  spot: ItemSpot;
  kind: 'item' | 'kit';
  name: string;
  unmet: Prerequisite[];
}

/**
 * Equipped items and installed kits whose prerequisites are not met, in the
 * slot order. The right arm mirroring a two-handed weapon is skipped: the
 * weapon is already listed on the left arm.
 */
export const collectUnmetPrerequisites = (
  items: ItemsState,
  kits: KitsState,
  context: PrerequisiteContext,
): UnmetPrerequisitesEntry[] =>
  ItemSpotValue.flatMap((spot) => {
    const item = items[spot];
    if (!item || isTwoHandedOffhand(items, spot)) return [];

    const entries: UnmetPrerequisitesEntry[] = [];
    const itemUnmet = findUnmetPrerequisites(item.prerequisites, context);
    if (itemUnmet.length > 0) {
      entries.push({ spot, kind: 'item', name: item.name, unmet: itemUnmet });
    }
    kits[spot].forEach(({ kit }) => {
      const kitUnmet = findUnmetPrerequisites(kit.prerequisites, context);
      if (kitUnmet.length > 0) {
        entries.push({ spot, kind: 'kit', name: kit.name, unmet: kitUnmet });
      }
    });
    return entries;
  });
