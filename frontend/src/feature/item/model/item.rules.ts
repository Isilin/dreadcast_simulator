import type { ItemType } from './item.types';

import type { ItemSpot } from '@/domain/suit';

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
