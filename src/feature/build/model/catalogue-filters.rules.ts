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
import type { Kit } from '@/feature/kit';

/** Filters of the equipment catalogue, on top of the slot and the search. */
export interface EquipmentFilters {
  /** Items giving a bonus on any of these stats. */
  stats: Stat[];
  weaponKind: WeaponKind | null;
  weaponHands: WeaponHands | null;
  healOnly: boolean;
  /** Only items whose prerequisites are met (race, implants and titles). */
  equippableOnly: boolean;
}

export const EMPTY_EQUIPMENT_FILTERS: EquipmentFilters = {
  stats: [],
  weaponKind: null,
  weaponHands: null,
  healOnly: false,
  equippableOnly: false,
};

/** Filters of the kit catalogue, on top of the item type and the search. */
export interface KitFilters {
  /** Kits giving a bonus on any of these stats. */
  stats: Stat[];
  /** Only kits whose tech cost fits in the points left on the item. */
  withinTechBudget: boolean;
  /** Only kits whose prerequisites are met (race, implants and titles). */
  equippableOnly: boolean;
}

export const EMPTY_KIT_FILTERS: KitFilters = {
  stats: [],
  withinTechBudget: false,
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
const SPECIALIZATION_PRESETS: Record<
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

const arePresetStatsSelected = (
  stats: readonly Stat[],
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): boolean =>
  getPresetStats(specialization, availableStats).every((stat) =>
    stats.includes(stat),
  );

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
    arePresetStatsSelected(filters.stats, specialization, availableStats) &&
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

/**
 * Kits have no weapon nor heal part: a specialization only applies the stats
 * given by the kit catalogue.
 */
export const canApplyKitSpecialization = (
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): boolean => getPresetStats(specialization, availableStats).length > 0;

export const isKitSpecializationActive = (
  filters: KitFilters,
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): boolean =>
  canApplyKitSpecialization(specialization, availableStats) &&
  arePresetStatsSelected(filters.stats, specialization, availableStats);

/**
 * Applies the stats of a specialization (replacing the selected ones), or
 * removes them when it is already active.
 */
export const toggleKitSpecialization = (
  filters: KitFilters,
  specialization: PresetSpecialization,
  availableStats: readonly Stat[],
): KitFilters => {
  const preset = SPECIALIZATION_PRESETS[specialization];

  return {
    ...filters,
    stats: isKitSpecializationActive(filters, specialization, availableStats)
      ? filters.stats.filter((stat) => !preset.stats.includes(stat))
      : getPresetStats(specialization, availableStats),
  };
};

export const toggleStat = <F extends { stats: Stat[] }>(
  filters: F,
  stat: Stat,
): F => ({
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

export const countActiveKitFilters = (filters: KitFilters): number =>
  [
    filters.stats.length > 0,
    filters.withinTechBudget,
    filters.equippableOnly,
  ].filter(Boolean).length;

/**
 * Stats given as a bonus by at least one item or kit, in the StatValues
 * order.
 */
export const getBonusStats = (
  entries: readonly Pick<Item, 'effects'>[],
): Stat[] => {
  const stats = new Set<Stat>();
  entries.forEach((entry) =>
    entry.effects?.forEach((effect) => {
      if (effect.value > 0) stats.add(effect.property);
    }),
  );
  return (Object.keys(StatValues) as Stat[]).filter((stat) => stats.has(stat));
};

/**
 * Keeps the entries giving a bonus on any of the stats (all of them without
 * stats) and passing the other filters, sorted by this bonus when stats are
 * selected (best first, ties keep their order).
 */
const filterByStatBonus = <T extends Pick<Item, 'effects'>>(
  entries: readonly T[],
  stats: readonly Stat[],
  matchesOtherFilters: (entry: T) => boolean,
): T[] => {
  const matching = entries
    .map((entry) => ({ entry, bonus: getItemStatBonus(entry, stats) }))
    .filter(
      ({ entry, bonus }) =>
        (stats.length === 0 || bonus > 0) && matchesOtherFilters(entry),
    );

  if (stats.length > 0) {
    matching.sort((a, b) => b.bonus - a.bonus);
  }

  return matching.map(({ entry }) => entry);
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
  const weaponTypes: readonly Item['type'][] = isArmSpot
    ? weaponFilterToItemTypes(filters.weaponKind, filters.weaponHands)
    : [];
  const healOnly = isArmSpot && filters.healOnly;

  return filterByStatBonus(
    items,
    filters.stats,
    (item) =>
      (weaponTypes.length === 0 || weaponTypes.includes(item.type)) &&
      (!healOnly || isHealWeapon(item)) &&
      (!filters.equippableOnly || isEquippable(item)),
  );
};

interface FilterKitsOptions {
  /** Tech points left on the item once its kits are installed. */
  remainingTech: number;
  isEquippable: (kit: Kit) => boolean;
}

/**
 * Keeps the kits matching the filters. With selected stats, the kits are
 * sorted by their bonus on these stats (best first, ties keep their order).
 */
export const filterKits = (
  kits: readonly Kit[],
  filters: KitFilters,
  { remainingTech, isEquippable }: FilterKitsOptions,
): Kit[] =>
  filterByStatBonus(
    kits,
    filters.stats,
    (kit) =>
      (!filters.withinTechBudget || kit.tech <= remainingTech) &&
      (!filters.equippableOnly || isEquippable(kit)),
  );
