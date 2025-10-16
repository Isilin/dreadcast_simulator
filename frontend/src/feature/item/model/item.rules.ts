import { type ItemType, type ItemsState } from './item.types';

import { ItemSpotValue, StatValues, type ItemSpot, type Stat } from '@/domain';

export const getOtherHand = (spot: ItemSpot, hands: number | undefined) => {
  if (
    (spot !== 'leftArm' && spot !== 'rightArm') ||
    hands === undefined ||
    hands === 1
  )
    return undefined;
  else return spot === 'leftArm' ? 'rightArm' : 'leftArm';
};

export const itemMatchsSpot = (type: ItemType, spot: ItemSpot) => {
  return (
    type === spot ||
    ((type === '1handMelee' ||
      type === '1handShot' ||
      type === '2handsMelee' ||
      type === '2handsShot') &&
      (spot === 'leftArm' || spot === 'rightArm'))
  );
};

export const getItemTypes = (spot: ItemSpot): ItemType[] => {
  if (spot === 'rightArm' || spot === 'leftArm') {
    return ['1handMelee', '1handMelee', '2handsMelee', '2handsShot'];
  }
  return [spot as ItemType];
};

export const computeItemsEffect = (state: ItemsState): Record<Stat, number> => {
  const res = Object.fromEntries(
    Object.entries(StatValues).map((s) => [s[0], 0]),
  ) as Record<Stat, number>;
  Object.values(ItemSpotValue).forEach((spot) =>
    state[spot]?.effects?.forEach((effect) => {
      if (res[effect.property as Stat] === undefined) {
        res[effect.property as Stat] = 0;
      }
      res[effect.property as Stat] += effect.value;
    }),
  );
  return res;
};
