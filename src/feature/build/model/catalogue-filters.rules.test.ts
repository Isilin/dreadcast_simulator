import { describe, expect, it } from 'vitest';

import {
  canApplyKitSpecialization,
  canApplySpecialization,
  countActiveEquipmentFilters,
  countActiveKitFilters,
  EMPTY_EQUIPMENT_FILTERS,
  EMPTY_KIT_FILTERS,
  filterEquipment,
  filterKits,
  getBonusStats,
  getPresetStats,
  isKitSpecializationActive,
  isSpecializationActive,
  PresetSpecializationValues,
  toggleKitSpecialization,
  toggleSpecialization,
  toggleStat,
  type EquipmentFilters,
  type KitFilters,
} from './catalogue-filters.rules';

import { StatValues, type Stat } from '@/domain';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

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

const kit = (id: string, overrides: Partial<Kit> = {}): Kit => ({
  id,
  name: id,
  tech: 50,
  type: 'head',
  effects: [],
  ...overrides,
});

const kitFilters = (overrides: Partial<KitFilters>): KitFilters => ({
  ...EMPTY_KIT_FILTERS,
  ...overrides,
});

const ids = (entries: readonly { id: string }[]) => entries.map(({ id }) => id);
const everything = { isArmSpot: true, isEquippable: () => true };
const anyKit = { remainingTech: 1000, isEquippable: () => true };

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

  it('lists the stats given as a bonus by kits', () => {
    const kits = [
      kit('a', { effects: [{ property: 'agility', value: 3 }] }),
      kit('b', { effects: [{ property: 'robustness', value: -2 }] }),
    ];

    expect(getBonusStats(kits)).toEqual(['agility']);
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

describe('kit specialization presets', () => {
  const kitStats: Stat[] = ['strength', 'agility', 'perception', 'stealth'];

  it('only applies the stats given by the kit catalogue', () => {
    expect(
      toggleKitSpecialization(EMPTY_KIT_FILTERS, 'tireur', kitStats),
    ).toEqual(kitFilters({ stats: ['perception'] }));
    expect(
      toggleKitSpecialization(
        kitFilters({ stats: ['strength'], withinTechBudget: true }),
        'furtif',
        kitStats,
      ),
    ).toEqual(
      kitFilters({ stats: ['stealth', 'agility'], withinTechBudget: true }),
    );
  });

  it('cannot apply a specialization without kit stats', () => {
    expect(canApplyKitSpecialization('soutien', kitStats)).toBe(false);
    expect(canApplyKitSpecialization('medecin', kitStats)).toBe(false);
    expect(
      isKitSpecializationActive(EMPTY_KIT_FILTERS, 'soutien', kitStats),
    ).toBe(false);
  });

  it('is active when all its kit stats are selected', () => {
    expect(
      isKitSpecializationActive(
        kitFilters({ stats: ['stealth'] }),
        'furtif',
        kitStats,
      ),
    ).toBe(false);
    expect(
      isKitSpecializationActive(
        kitFilters({ stats: ['agility', 'stealth'] }),
        'furtif',
        kitStats,
      ),
    ).toBe(true);
  });

  it('removes its stats when toggled again', () => {
    const active = toggleKitSpecialization(
      EMPTY_KIT_FILTERS,
      'combattant_cac',
      kitStats,
    );

    expect(
      toggleKitSpecialization(
        toggleStat(active, 'agility'),
        'combattant_cac',
        kitStats,
      ),
    ).toEqual(kitFilters({ stats: ['agility'] }));
  });
});

describe('countActiveKitFilters', () => {
  it('counts one per filter group', () => {
    expect(countActiveKitFilters(EMPTY_KIT_FILTERS)).toBe(0);
    expect(
      countActiveKitFilters({
        stats: ['agility', 'stealth'],
        withinTechBudget: true,
        equippableOnly: true,
      }),
    ).toBe(3);
  });
});

describe('filterKits', () => {
  it('keeps every kit without filters', () => {
    const kits = [kit('a'), kit('b', { tech: 5000 })];
    expect(ids(filterKits(kits, EMPTY_KIT_FILTERS, anyKit))).toEqual([
      'a',
      'b',
    ]);
  });

  it('keeps the kits giving a bonus on any selected stat, best first', () => {
    const kits = [
      kit('small', { effects: [{ property: 'agility', value: 2 }] }),
      kit('malus', { effects: [{ property: 'agility', value: -4 }] }),
      kit('other', { effects: [{ property: 'strength', value: 9 }] }),
      kit('big', {
        effects: [
          { property: 'agility', value: 5 },
          { property: 'stealth', value: 3 },
        ],
      }),
      kit('tie', { effects: [{ property: 'stealth', value: 2 }] }),
    ];

    expect(
      ids(
        filterKits(kits, kitFilters({ stats: ['agility', 'stealth'] }), anyKit),
      ),
    ).toEqual(['big', 'small', 'tie']);
  });

  it('keeps the kits fitting in the tech left when asked', () => {
    const kits = [
      kit('free', { tech: 0 }),
      kit('fits', { tech: 60 }),
      kit('exact', { tech: 80 }),
      kit('over', { tech: 81 }),
    ];
    const budget = kitFilters({ withinTechBudget: true });

    expect(
      ids(filterKits(kits, budget, { ...anyKit, remainingTech: 80 })),
    ).toEqual(['free', 'fits', 'exact']);
    expect(
      ids(filterKits(kits, budget, { ...anyKit, remainingTech: -20 })),
    ).toEqual([]);
    expect(
      ids(filterKits(kits, EMPTY_KIT_FILTERS, { ...anyKit, remainingTech: 0 })),
    ).toHaveLength(4);
  });

  it('keeps the equippable kits only when asked', () => {
    const kits = [kit('ok'), kit('locked')];
    const options = {
      remainingTech: 1000,
      isEquippable: (entry: Kit) => entry.id === 'ok',
    };

    expect(ids(filterKits(kits, EMPTY_KIT_FILTERS, options))).toEqual([
      'ok',
      'locked',
    ]);
    expect(
      ids(filterKits(kits, kitFilters({ equippableOnly: true }), options)),
    ).toEqual(['ok']);
  });
});
