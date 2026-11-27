import { z } from '@hono/zod-openapi';

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

export const StatProperty = z.enum(STAT_KEYS);

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

export const ItemType = z.enum(ITEM_TYPES);

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

export const RaceType = z.enum(RACE_TYPES);

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

export const ImplantName = z.enum(IMPLANT_NAMES);

const NonEmptyString = z.string().min(1);
const NonNegative = z.number().min(0);
const NullableNonNegative = NonNegative.nullable();
const Bounded = (minimum: number, maximum: number) =>
  z.number().min(minimum).max(maximum).nullable();

const StatModifier = z.object({
  property: StatProperty,
  value: z.number(),
});

const TitlePrerequisite = z.object({ title_id: NonEmptyString });

const ImplantPrerequisite = z.object({
  implant: z.object({ name: ImplantName }).nullable(),
});

const RacePrerequisite = z.object({ race: RaceType });

export const Item = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
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
    item_prerequisite: z.array(StatModifier),
    item_prerequisite_title: z.array(TitlePrerequisite),
    item_prerequisite_implant: z.array(ImplantPrerequisite),
    item_prerequisite_race: z.array(RacePrerequisite),
    item_effect: z.array(StatModifier),
  })
  .openapi('Item');

export const Kit = z
  .object({
    id: z.string(),
    name: z.string(),
    tech: NonNegative,
    type: ItemType,
    kit_effect: z.array(StatModifier),
    kit_prerequisite: z.array(StatModifier),
    kit_prerequisite_title: z.array(TitlePrerequisite),
    kit_prerequisite_implant: z.array(ImplantPrerequisite),
    kit_prerequisite_race: z.array(RacePrerequisite),
  })
  .openapi('Kit');

const PositiveInt = z.number().int().min(1);

export const Implant = z
  .object({
    id: z.number().int().min(0),
    name: ImplantName,
    level_max: PositiveInt,
    implant_attribute: z.array(z.object({ attribute: StatProperty })),
    implant_value: z.array(z.object({ level: PositiveInt, value: z.number() })),
  })
  .openapi('Implant');

export const Race = z
  .object({
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
  })
  .openapi('Race');

export const Title = z
  .object({
    id: NonEmptyString,
    name: NonEmptyString,
  })
  .openapi('Title');

export const Drug = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
    stat_modifier: z.array(StatModifier),
  })
  .openapi('Drug');

export type Item = z.infer<typeof Item>;
export type Kit = z.infer<typeof Kit>;
export type Implant = z.infer<typeof Implant>;
export type Race = z.infer<typeof Race>;
export type Title = z.infer<typeof Title>;
export type Drug = z.infer<typeof Drug>;
