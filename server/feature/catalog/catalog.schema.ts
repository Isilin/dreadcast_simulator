import { Schema } from 'effect';

/**
 * Canonical stat order: stat_property enum, src/domain/stats.ts and
 * private.community_stat_keys() (parity-tested).
 */
export const STAT_KEYS = [
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
  'health',
  'stamina',
  'integrity',
  'speed',
  'raceDamage',
  'hitRating',
  'teamHeal',
  'cacDamage',
  'criticalCacChance',
  'criticalCacDamage',
  'hitDamages',
  'criticalHitDamage',
] as const;

export const StatProperty = Schema.Literals(STAT_KEYS);

/** Mirrors the item_type enum. */
export const ITEM_TYPES = [
  'head',
  'chest',
  'legs',
  'feet',
  'secondary',
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee',
] as const;

export const ItemType = Schema.Literals(ITEM_TYPES);

/** Mirrors the race_type enum (and src/feature/profile). */
export const RACE_TYPES = [
  'Humain',
  'Elfe',
  'Nain',
  'Orc',
  'Troll',
  'Outrilien',
  'Vautour',
  'Gobelin',
  'Kobold',
  'Gnoll',
  'Androide',
] as const;

export const RaceType = Schema.Literals(RACE_TYPES);

/** Mirrors the implant table (and src/feature/implant, parity-tested). */
export const IMPLANT_NAMES = [
  'Génie',
  'Réplicateur',
  'Sain et sauf',
  'Chameau',
  'Monsieur Clone',
  'Geek',
  'Chanceux',
  'Raciste',
  'Urgentiste',
  'Prestidigitateur',
  'Flash Gordon',
  'Inépuisable',
  "Peau d'argent",
  'Ingénieur',
  'Brute',
  'Rôdeur',
  "Peau d'acier",
  'La Main Bleue',
  'Éclaireur',
  'Je te vois',
  'Scientifique',
  'Économe',
  'Félin',
  'Aide de camp',
  'Commando',
  'Ninja',
  'Polyvalent',
  "Tireur d'élite",
  'Oeil de lynx',
  'Enragé',
] as const;

export const ImplantName = Schema.Literals(IMPLANT_NAMES);

const NonEmptyString = Schema.String.check(Schema.isMinLength(1));
const NonNegative = Schema.Number.check(Schema.isGreaterThanOrEqualTo(0));
const NullableNonNegative = Schema.NullOr(NonNegative);
const Bounded = (minimum: number, maximum: number) =>
  Schema.NullOr(Schema.Number.check(Schema.isBetween({ minimum, maximum })));

const StatModifier = Schema.Struct({
  property: StatProperty,
  value: Schema.Number,
});

const TitlePrerequisite = Schema.Struct({ title_id: NonEmptyString });

const ImplantPrerequisite = Schema.Struct({
  implant: Schema.NullOr(Schema.Struct({ name: ImplantName })),
});

const RacePrerequisite = Schema.Struct({ race: RaceType });

export const Item = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  image: Schema.String,
  tech: NonNegative,
  integrity: NonNegative,
  type: ItemType,
  min_damage: NullableNonNegative,
  max_damage: NullableNonNegative,
  min_heal: NullableNonNegative,
  max_heal: NullableNonNegative,
  damage_bonus: Bounded(0, 5),
  hands: Bounded(1, 2),
  reach: Bounded(0, 14),
  hits_per_round: NullableNonNegative,
  item_prerequisite: Schema.Array(StatModifier),
  item_prerequisite_title: Schema.Array(TitlePrerequisite),
  item_prerequisite_implant: Schema.Array(ImplantPrerequisite),
  item_prerequisite_race: Schema.Array(RacePrerequisite),
  item_effect: Schema.Array(StatModifier),
});

export const Kit = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  tech: NonNegative,
  type: ItemType,
  kit_effect: Schema.Array(StatModifier),
  kit_prerequisite: Schema.Array(StatModifier),
  kit_prerequisite_title: Schema.Array(TitlePrerequisite),
  kit_prerequisite_implant: Schema.Array(ImplantPrerequisite),
  kit_prerequisite_race: Schema.Array(RacePrerequisite),
});

const PositiveInt = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));

export const Implant = Schema.Struct({
  id: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
  name: ImplantName,
  level_max: PositiveInt,
  implant_attribute: Schema.Array(Schema.Struct({ attribute: StatProperty })),
  implant_value: Schema.Array(
    Schema.Struct({ level: PositiveInt, value: Schema.Number }),
  ),
});

export const Race = Schema.Struct({
  type: RaceType,
  strength: NonNegative,
  agility: NonNegative,
  robustness: NonNegative,
  perception: NonNegative,
  stealth: NonNegative,
  computing: NonNegative,
  medicine: NonNegative,
  engineering: NonNegative,
  health: NonNegative,
  stamina: NonNegative,
});

export const Title = Schema.Struct({
  id: NonEmptyString,
  name: NonEmptyString,
});

export const Drug = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  image: Schema.String,
  stat_modifier: Schema.Array(StatModifier),
});

export type Item = typeof Item.Type;
export type Kit = typeof Kit.Type;
export type Implant = typeof Implant.Type;
export type Race = typeof Race.Type;
export type Title = typeof Title.Type;
export type Drug = typeof Drug.Type;
