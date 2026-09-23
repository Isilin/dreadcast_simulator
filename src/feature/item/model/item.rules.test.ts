import { describe, expect, it } from 'vitest';

import { getItemTypes, getOtherHand, itemMatchsSpot } from './item.rules';

describe('item rules', () => {
  it('includes one-handed shot weapons in arm selectors', () => {
    expect(getItemTypes('leftArm')).toEqual([
      '1handMelee',
      '1handShot',
      '2handsMelee',
      '2handsShot',
    ]);
  });

  it('returns the opposite arm only for two-handed weapons', () => {
    expect(getOtherHand('leftArm', 2)).toBe('rightArm');
    expect(getOtherHand('rightArm', 2)).toBe('leftArm');
    expect(getOtherHand('leftArm', 1)).toBeUndefined();
    expect(getOtherHand('head', 2)).toBeUndefined();
  });

  it('allows every weapon family in arm slots only', () => {
    expect(itemMatchsSpot('1handShot', 'leftArm')).toBe(true);
    expect(itemMatchsSpot('2handsShot', 'rightArm')).toBe(true);
    expect(itemMatchsSpot('1handShot', 'head')).toBe(false);
  });
});
