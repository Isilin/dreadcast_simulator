import {
  SpecializationValues,
  StatValues,
  type Specialization,
  type Stat,
} from '@/domain';
import {
  getItemStatBonus,
  isHealWeapon,
  weaponFilterToItemTypes,
  type Item,
  type WeaponHands,
  type WeaponKind,
} from '@/feature/item';

/** Filters of the equipment catalogue, on top of the slot and the search. */
export interface EquipmentFilters {
  /** Items giving a bonus on any of these stats. */
  stats: Stat[];
  weaponKind: WeaponKind | null;
  weaponHands: WeaponHands | null;
  healOnly: boolean;
  /** Only items whose prerequisites are met by the race and the implants. */
  equippableOnly: boolean;
}

export const EMPTY_EQUIPMENT_FILTERS: EquipmentFilters = {
  stats: [],
  weaponKind: null,
  weaponHands: null,
  healOnly: false,
  equippableOnly: false,
};

export type PresetSpecialization = Exclude<Specialization, 'polyvalent'>;

interface SpecializationPreset {
  stats: Stat[];
  weaponKind: WeaponKind | null;
  healOnly: boolean;
}

/**
 * Stats and weapons of each specialization, following the scores of
 * detectSpecialization (community feature).
 */
export const SPECIALIZATION_PRESETS: Record<
  PresetSpecialization,
  SpecializationPreset
> = {
  medecin: { stats: ['medicine'], weaponKind: null, healOnly: false },
  informaticien: { stats: ['computing'], weaponKind: null, healOnly: false },
  ingenieur: { stats: ['engineering'], weaponKind: null, healOnly: false },
  combattant_cac: {
    stats: ['strength', 'cacDamage', 'criticalCacChance', 'criticalCacDamage'],
    weaponKind: 'melee',
    healOnly: false,
  },
  tireur: {
    stats: ['perception', 'hitDamages', 'criticalHitDamage'],
    weaponKind: 'shot',
    healOnly: false,
  },
  furtif: { stats: ['stealth', 'agility'], weaponKind: null, healOnly: false },
  tank: { stats: ['robustness', 'health'], weaponKind: null, healOnly: false },
  // No item gives a team heal bonus: heal weapons only.
  soutien: { stats: [], weaponKind: null, healOnly: true },
};

export const PresetSpecializationValues = SpecializationValues.filter(
  (value): value is PresetSpecialization => value !== 'polyvalent',
);

/**
 * Stats of a specialization given by the catalogue: stats no item gives
 * would only add chips without changing the results.
 */
export const getPresetStats = (
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): Stat[] =>
  SPECIALIZATION_PRESETS[specialization].stats.filter((stat) =>
    availableStats.includes(stat),
  );

/** False when the catalogue gives none of the specialization stats. */
export const canApplySpecialization = (
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): boolean =>
  SPECIALIZATION_PRESETS[specialization].healOnly ||
  getPresetStats(specialization, availableStats).length > 0;

/**
 * A specialization is active when all its available stats (or heal weapons)
 * are selected.
 */
export const isSpecializationActive = (
  filters: EquipmentFilters,
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): boolean => {
  const preset = SPECIALIZATION_PRESETS[specialization];
  return (
    canApplySpecialization(specialization, availableStats) &&
    getPresetStats(specialization, availableStats).every((stat) =>
      filters.stats.includes(stat),
    ) &&
    (!preset.healOnly || filters.healOnly)
  );
};

/**
 * Applies a specialization preset (replacing the stats and the weapon kind),
 * or removes it when it is already active.
 */
export const toggleSpecialization = (
  filters: EquipmentFilters,
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): EquipmentFilters => {
  const preset = SPECIALIZATION_PRESETS[specialization];

  if (!isSpecializationActive(filters, specialization, availableStats)) {
    return {
      ...filters,
      stats: getPresetStats(specialization, availableStats),
      weaponKind: preset.weaponKind,
      healOnly: preset.healOnly,
    };
  }

  return {
    ...filters,
    stats: filters.stats.filter((stat) => !preset.stats.includes(stat)),
    weaponKind:
      preset.weaponKind && filters.weaponKind === preset.weaponKind
        ? null
        : filters.weaponKind,
    healOnly: preset.healOnly ? false : filters.healOnly,
  };
};

export const toggleStat = (
  filters: EquipmentFilters,
  stat: Stat,
): EquipmentFilters => ({
  ...filters,
  stats: filters.stats.includes(stat)
    ? filters.stats.filter((entry) => entry !== stat)
    : [...filters.stats, stat],
});

/** Active filter groups; weapon filters only count on the arm slots. */
export const countActiveEquipmentFilters = (
  filters: EquipmentFilters,
  isArmSpot: boolean,
): number =>
  [
    filters.stats.length > 0,
    isArmSpot && (filters.weaponKind !== null || filters.weaponHands !== null),
    isArmSpot && filters.healOnly,
    filters.equippableOnly,
  ].filter(Boolean).length;

/** Stats given as a bonus by at least one item, in the StatValues order. */
export const getBonusStats = (items: readonly Item[]): Stat[] => {
  const stats = new Set<Stat>();
  items.forEach((item) =>
    item.effects?.forEach((effect) => {
      if (effect.value > 0) stats.add(effect.property);
    }),
  );
  return (Object.keys(StatValues) as Stat[]).filter((stat) => stats.has(stat));
};

interface FilterEquipmentOptions {
  isArmSpot: boolean;
  isEquippable: (item: Item) => boolean;
}

/**
 * Keeps the items matching the filters. With selected stats, the items are
 * sorted by their bonus on these stats (best first, ties keep their order).
 */
export const filterEquipment = (
  items: readonly Item[],
  filters: EquipmentFilters,
  { isArmSpot, isEquippable }: FilterEquipmentOptions,
): Item[] => {
  const weaponTypes = isArmSpot
    ? weaponFilterToItemTypes(filters.weaponKind, filters.weaponHands)
    : [];
  const healOnly = isArmSpot && filters.healOnly;

  const matching = items
    .map((item) => ({ item, bonus: getItemStatBonus(item, filters.stats) }))
    .filter(
      ({ item, bonus }) =>
        (filters.stats.length === 0 || bonus > 0) &&
        (weaponTypes.length === 0 || weaponTypes.includes(item.type)) &&
        (!healOnly || isHealWeapon(item)) &&
        (!filters.equippableOnly || isEquippable(item)),
    );

  if (filters.stats.length > 0) {
    matching.sort((a, b) => b.bonus - a.bonus);
  }

  return matching.map(({ item }) => item);
};
