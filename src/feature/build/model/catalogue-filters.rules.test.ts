import { describe, expect, it } from 'vitest';

import {
  canApplySpecialization,
  countActiveEquipmentFilters,
  EMPTY_EQUIPMENT_FILTERS,
  filterEquipment,
  getBonusStats,
  getPresetStats,
  isSpecializationActive,
  PresetSpecializationValues,
  toggleSpecialization,
  toggleStat,
  type EquipmentFilters,
} from './catalogue-filters.rules';

import { StatValues, type Stat } from '@/domain';
import type { Item } from '@/feature/item';

const item = (id: string, overrides: Partial<Item> = {}): Item => ({
  id,
  name: id,
  image: '',
  tech: 100,
  integrity: 100,
  type: 'head',
  ...overrides,
});

const filters = (overrides: Partial<EquipmentFilters>): EquipmentFilters => ({
  ...EMPTY_EQUIPMENT_FILTERS,
  ...overrides,
});

const ids = (items: Item[]) => items.map(({ id }) => id);
const everything = { isArmSpot: true, isEquippable: () => true };

describe('specialization presets', () => {
  const allStats = Object.keys(StatValues) as Stat[];

  it('excludes the polyvalent specialization', () => {
    expect(PresetSpecializationValues).not.toContain('polyvalent');
    expect(PresetSpecializationValues).toHaveLength(8);
  });

  it('replaces the stats and the weapon filters', () => {
    const current = filters({
      stats: ['medicine', 'strength'],
      weaponHands: 2,
      healOnly: true,
      equippableOnly: true,
    });

    expect(toggleSpecialization(current, 'tireur', allStats)).toEqual({
      stats: ['perception', 'hitDamages', 'criticalHitDamage'],
      weaponKind: 'shot',
      weaponHands: 2,
      healOnly: false,
      equippableOnly: true,
    });
    expect(
      toggleSpecialization(
        { ...current, weaponKind: 'melee', healOnly: false },
        'soutien',
        allStats,
      ),
    ).toMatchObject({
      stats: [],
      weaponKind: null,
      healOnly: true,
    });
  });

  it('only selects the stats given by the catalogue', () => {
    const available: Stat[] = ['strength', 'perception', 'medicine'];

    expect(getPresetStats('combattant_cac', available)).toEqual(['strength']);
    expect(
      toggleSpecialization(EMPTY_EQUIPMENT_FILTERS, 'tireur', available).stats,
    ).toEqual(['perception']);
    expect(
      isSpecializationActive(
        filters({ stats: ['perception'] }),
        'tireur',
        available,
      ),
    ).toBe(true);
  });

  it('cannot apply a specialization without catalogue stats', () => {
    expect(canApplySpecialization('ingenieur', ['strength'])).toBe(false);
    expect(
      isSpecializationActive(EMPTY_EQUIPMENT_FILTERS, 'ingenieur', ['strength']),
    ).toBe(false);
    expect(canApplySpecialization('soutien', [])).toBe(true);
  });

  it('is active when its heal weapons are selected', () => {
    expect(
      isSpecializationActive(EMPTY_EQUIPMENT_FILTERS, 'soutien', allStats),
    ).toBe(false);
    expect(
      isSpecializationActive(filters({ healOnly: true }), 'soutien', allStats),
    ).toBe(true);
  });

  it('is active when all its stats are selected', () => {
    expect(
      isSpecializationActive(
        filters({ stats: ['stealth'] }),
        'furtif',
        allStats,
      ),
    ).toBe(false);
    expect(
      isSpecializationActive(
        filters({ stats: ['agility', 'stealth', 'medicine'] }),
        'furtif',
        allStats,
      ),
    ).toBe(true);
  });

  it('removes its stats and weapon filters when toggled again', () => {
    const active = toggleSpecialization(
      filters({ weaponHands: 1 }),
      'combattant_cac',
      allStats,
    );
    const withExtra = toggleStat(active, 'speed');

    expect(toggleSpecialization(withExtra, 'combattant_cac', allStats)).toEqual(
      filters({ stats: ['speed'], weaponHands: 1 }),
    );
    expect(
      toggleSpecialization(
        toggleSpecialization(filters({}), 'soutien', allStats),
        'soutien',
        allStats,
      ),
    ).toEqual(EMPTY_EQUIPMENT_FILTERS);
  });
});

describe('toggleStat', () => {
  it('adds then removes a stat', () => {
    const added = toggleStat(EMPTY_EQUIPMENT_FILTERS, 'speed');
    expect(added.stats).toEqual(['speed']);
    expect(toggleStat(added, 'speed').stats).toEqual([]);
  });
});

describe('countActiveEquipmentFilters', () => {
  const all = filters({
    stats: ['perception', 'hitDamages'],
    weaponKind: 'shot',
    weaponHands: 1,
    healOnly: true,
    equippableOnly: true,
  });

  it('counts one per filter group', () => {
    expect(countActiveEquipmentFilters(EMPTY_EQUIPMENT_FILTERS, true)).toBe(0);
    expect(countActiveEquipmentFilters(all, true)).toBe(4);
  });

  it('ignores the weapon filters outside the arm slots', () => {
    expect(countActiveEquipmentFilters(all, false)).toBe(2);
  });
});

describe('getBonusStats', () => {
  it('lists the stats given as a bonus, in the stat order', () => {
    const items = [
      item('a', {
        effects: [
          { property: 'medicine', value: 5 },
          { property: 'agility', value: -3 },
        ],
      }),
      item('b', { effects: [{ property: 'strength', value: 2 }] }),
      item('c'),
    ];

    expect(getBonusStats(items)).toEqual(['strength', 'medicine']);
  });
});

describe('filterEquipment', () => {
  it('keeps every item without filters', () => {
    const items = [item('a'), item('b')];
    expect(ids(filterEquipment(items, EMPTY_EQUIPMENT_FILTERS, everything))).toEqual(
      ['a', 'b'],
    );
  });

  it('keeps the items giving a bonus on any selected stat, best first', () => {
    const items = [
      item('small', { effects: [{ property: 'perception', value: 2 }] }),
      item('malus', { effects: [{ property: 'perception', value: -4 }] }),
      item('other', { effects: [{ property: 'strength', value: 9 }] }),
      item('big', {
        effects: [
          { property: 'perception', value: 5 },
          { property: 'hitDamages', value: 3 },
        ],
      }),
      item('tie', { effects: [{ property: 'hitDamages', value: 2 }] }),
    ];

    expect(
      ids(
        filterEquipment(
          items,
          filters({ stats: ['perception', 'hitDamages'] }),
          everything,
        ),
      ),
    ).toEqual(['big', 'small', 'tie']);
  });

  it('filters the weapons on the arm slots only', () => {
    const items = [
      item('sword', { type: '1handMelee' }),
      item('rifle', { type: '2handsShot' }),
      item('pistol', { type: '1handShot' }),
      item('healer', { type: '1handShot', minHeal: 10 }),
    ];
    const shot = filters({ weaponKind: 'shot', weaponHands: 1 });
    const heal = filters({ healOnly: true });

    expect(ids(filterEquipment(items, shot, everything))).toEqual([
      'pistol',
      'healer',
    ]);
    expect(ids(filterEquipment(items, heal, everything))).toEqual(['healer']);
    expect(
      ids(filterEquipment(items, shot, { ...everything, isArmSpot: false })),
    ).toHaveLength(4);
    expect(
      ids(filterEquipment(items, heal, { ...everything, isArmSpot: false })),
    ).toHaveLength(4);
  });

  it('keeps the equippable items only when asked', () => {
    const items = [item('ok'), item('locked')];
    const options = {
      isArmSpot: false,
      isEquippable: (entry: Item) => entry.id === 'ok',
    };

    expect(ids(filterEquipment(items, EMPTY_EQUIPMENT_FILTERS, options))).toEqual(
      ['ok', 'locked'],
    );
    expect(
      ids(filterEquipment(items, filters({ equippableOnly: true }), options)),
    ).toEqual(['ok']);
  });
});
