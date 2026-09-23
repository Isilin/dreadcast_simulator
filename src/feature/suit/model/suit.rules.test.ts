import { describe, expect, it } from 'vitest';

import { BASE_HEALTH_STAMINA, computeSuitStats } from './suit.rules';

import { ItemSpotValue, type ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Implant } from '@/feature/implant';
import type { Item, ItemsState } from '@/feature/item';
import type { Kit, KitsState } from '@/feature/kit';

const emptyItems = (): ItemsState =>
  Object.fromEntries(ItemSpotValue.map((spot) => [spot, null])) as ItemsState;

const emptyKits = (): KitsState =>
  Object.fromEntries(
    ItemSpotValue.map((spot) => [spot, [] as KitsState[ItemSpot]]),
  ) as KitsState;

const raceStats = {
  strength: 100,
  agility: 100,
  perception: 100,
  medicine: 150,
  health: 480,
  stamina: 100,
};

const createItem = (overrides: Partial<Item>): Item => ({
  id: 'item',
  name: 'Item',
  image: '',
  tech: 0,
  integrity: 0,
  type: 'head',
  ...overrides,
});

const baseInput = () => ({
  raceStats,
  items: emptyItems(),
  kits: emptyKits(),
  implants: {},
  allImplants: [] as Implant[],
  drug: undefined as Drug | undefined,
});

describe('computeSuitStats', () => {
  it('adds the base health and stamina to the race stats', () => {
    const stats = computeSuitStats(baseInput());

    expect(stats.strength).toBe(100);
    expect(stats.medicine).toBe(150);
    expect(stats.health).toBe(480 + BASE_HEALTH_STAMINA);
    expect(stats.stamina).toBe(100 + BASE_HEALTH_STAMINA);
    expect(stats.teamHeal).toBe(0);
  });

  it('counts a two-handed weapon once although it fills both arms', () => {
    const sword = createItem({
      id: 'sword',
      type: '2handsMelee',
      hands: 2,
      effects: [{ property: 'strength', value: 10 }],
    });
    const items: Record<ItemSpot, Item | null> = {
      ...emptyItems(),
      leftArm: sword,
      rightArm: sword,
    };

    expect(computeSuitStats({ ...baseInput(), items }).strength).toBe(110);
  });

  it('multiplies kit effects by their number', () => {
    const kit: Kit = {
      id: 'kit',
      name: 'Kit',
      tech: 10,
      type: 'head',
      effects: [{ property: 'agility', value: 3 }],
    };
    const kits: KitsState = { ...emptyKits(), head: [{ kit, number: 2 }] };

    expect(computeSuitStats({ ...baseInput(), kits }).agility).toBe(106);
  });

  it('applies implant values for the installed level', () => {
    const brute: Implant = {
      id: 14,
      name: 'Brute',
      levelMax: 2,
      attributes: ['strength'],
      valuePerLevel: [5, 10],
    };

    const stats = computeSuitStats({
      ...baseInput(),
      implants: { Brute: 2 },
      allImplants: [brute],
    });

    expect(stats.strength).toBe(110);
  });

  it('applies drug side effects', () => {
    const drug: Drug = {
      id: 'drug',
      name: 'Drogue',
      image: '',
      sideEffects: [{ property: 'perception', value: -5 }],
    };

    expect(computeSuitStats({ ...baseInput(), drug }).perception).toBe(95);
  });
});
