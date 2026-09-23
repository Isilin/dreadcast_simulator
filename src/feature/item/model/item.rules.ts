import { type Item, type ItemType, type ItemsState } from './item.types';

import { ItemSpotValue, type ItemSpot, type Stat } from '@/domain';
import { createEmptyStats } from '@/utils/stats';

const ARM_SPOTS = ['leftArm', 'rightArm'] as const;
const HAND_WEAPONS = [
  '1handMelee',
  '1handShot',
  '2handsMelee',
  '2handsShot',
] as const;

export const isWeaponType = (type: ItemType): boolean =>
  HAND_WEAPONS.includes(type as (typeof HAND_WEAPONS)[number]);

/**
 * Heal weapons (e.g. Cobra F-750) have a heal range instead of damages.
 */
export const isHealWeapon = (
  item: Pick<Item, 'minHeal'> | null | undefined,
): boolean => item?.minHeal !== undefined;

/**
 * Gets the opposite arm spot when using two-handed weapons
 */
export const getOtherHand = (
  spot: ItemSpot,
  hands: number | undefined,
): ItemSpot | undefined => {
  if (
    !ARM_SPOTS.includes(spot as (typeof ARM_SPOTS)[number]) ||
    !hands ||
    hands === 1
  ) {
    return undefined;
  }
  return spot === 'leftArm' ? 'rightArm' : 'leftArm';
};

/**
 * Checks if an item type can be equipped in a given spot
 */
export const itemMatchsSpot = (type: ItemType, spot: ItemSpot): boolean => {
  return (
    type === spot ||
    (isWeaponType(type) &&
      ARM_SPOTS.includes(spot as (typeof ARM_SPOTS)[number]))
  );
};

/**
 * Gets the allowed item types for a given spot
 */
export const getItemTypes = (spot: ItemSpot): ItemType[] => {
  if (ARM_SPOTS.includes(spot as (typeof ARM_SPOTS)[number])) {
    return ['1handMelee', '1handShot', '2handsMelee', '2handsShot'];
  }
  return [spot as ItemType];
};

/**
 * Computes the total effects from all equipped items
 */
export const computeItemsEffect = (state: ItemsState): Record<Stat, number> => {
  const stats = createEmptyStats();
  Object.values(ItemSpotValue).forEach((spot) =>
    state[spot]?.effects?.forEach((effect) => {
      stats[effect.property as Stat] += effect.value;
    }),
  );
  return stats;
};

/**
 * Check if an item's prerequisites are met using only race and implants stats
 */
export const itemPrerequisitesMet = (
  item: unknown,
  raceStats: Partial<Record<Stat, number>>,
  implantsStats: Record<Stat, number>,
): boolean => {
  if (!item || typeof item !== 'object') return true;
  const asItem = item as {
    prerequisites?: { property: Stat; value: number }[];
  };
  if (!asItem.prerequisites) return true;
  return asItem.prerequisites.every((pr) => {
    const total =
      (raceStats?.[pr.property] ?? 0) + (implantsStats?.[pr.property] ?? 0);
    return total >= pr.value;
  });
};

/**
 * The right arm only mirrors a two-handed weapon held in the left arm: it is
 * not a second weapon (its effects are cancelled by the suit rules).
 */
export const isTwoHandedOffhand = (
  items: ItemsState,
  spot: ItemSpot,
): boolean => spot === 'rightArm' && (items.leftArm?.hands ?? 0) > 1;

/**
 * Slot to select once an item is equipped: a two-handed weapon is handled
 * from the left arm, the right arm only mirrors it.
 */
export const getEquippedSpot = (
  spot: ItemSpot,
  item: Pick<Item, 'hands'>,
): ItemSpot =>
  spot === 'rightArm' && (item.hands ?? 0) > 1 ? 'leftArm' : spot;
