import { describe, expect, it } from 'vitest';

import { computeSlotEffects } from './slot-effects';

import type { Item } from '@/feature/item';
import type { KitSelection } from '@/feature/kit';

const item: Item = {
  id: 'item-1',
  name: 'Casque',
  image: '/casque.webp',
  tech: 300,
  integrity: 90,
  type: 'head',
  effects: [
    { property: 'robustness', value: 5 },
    { property: 'agility', value: -1 },
  ],
};

const kits: KitSelection[] = [
  {
    kit: {
      id: 'kit-1',
      name: 'Lampe',
      tech: 60,
      type: 'head',
      effects: [
        { property: 'perception', value: 4 },
        { property: 'robustness', value: -1 },
      ],
    },
    number: 2,
  },
];

describe('computeSlotEffects', () => {
  it('adds the item effects and every kit copy', () => {
    expect(computeSlotEffects(item, kits)).toEqual([
      { property: 'agility', value: -1 },
      { property: 'robustness', value: 3 },
      { property: 'perception', value: 8 },
    ]);
  });

  it('is empty without an item, even with leftover kits', () => {
    expect(computeSlotEffects(null, kits)).toEqual([]);
  });

  it('handles items without effects', () => {
    expect(computeSlotEffects({ ...item, effects: undefined }, [])).toEqual(
      [],
    );
  });
});
