import { describe, expect, it } from 'vitest';

import {
  getEquippedSpot,
  getItemTypes,
  getOtherHand,
  isTwoHandedOffhand,
  itemMatchsSpot,
} from './item.rules';
import type { Item, ItemsState } from './item.types';

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

  it('flags the right arm as the offhand of a two-handed weapon only', () => {
    const weapon = (hands: number): Item => ({
      id: `weapon-${hands}`,
      name: 'Arme',
      image: '',
      tech: 100,
      integrity: 100,
      type: hands > 1 ? '2handsMelee' : '1handMelee',
      hands,
    });
    const items = (leftArm: Item | null, rightArm: Item | null) =>
      ({
        head: null,
        chest: null,
        legs: null,
        feet: null,
        secondary: null,
        leftArm,
        rightArm,
      }) as ItemsState;

    const twoHanded = weapon(2);
    expect(isTwoHandedOffhand(items(twoHanded, twoHanded), 'rightArm')).toBe(
      true,
    );
    expect(isTwoHandedOffhand(items(twoHanded, twoHanded), 'leftArm')).toBe(
      false,
    );
    expect(isTwoHandedOffhand(items(weapon(1), weapon(1)), 'rightArm')).toBe(
      false,
    );
    expect(isTwoHandedOffhand(items(null, null), 'rightArm')).toBe(false);
  });

  it('selects the left arm after equipping a two-handed weapon', () => {
    expect(getEquippedSpot('rightArm', { hands: 2 })).toBe('leftArm');
    expect(getEquippedSpot('rightArm', { hands: 1 })).toBe('rightArm');
    expect(getEquippedSpot('leftArm', { hands: 2 })).toBe('leftArm');
    expect(getEquippedSpot('head', {})).toBe('head');
  });
});
