import { Schema } from 'effect';

/** Mirrors the stat_property enum (and src/domain/stats.ts). */
export const StatProperty = Schema.Literals([
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
]);

/** Mirrors the item_type enum. */
export const ItemType = Schema.Literals([
  'head',
  'chest',
  'legs',
  'feet',
  'secondary',
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee',
]);

/** Mirrors the race_type enum. */
export const RaceType = Schema.Literals([
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
]);

const StatModifier = Schema.Struct({
  property: StatProperty,
  value: Schema.Number,
});

const TitlePrerequisite = Schema.Struct({ title_id: Schema.String });

const ImplantPrerequisite = Schema.Struct({
  implant: Schema.NullOr(Schema.Struct({ name: Schema.String })),
});

const RacePrerequisite = Schema.Struct({ race: Schema.String });

const NullableNumber = Schema.NullOr(Schema.Number);

export const Item = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  image: Schema.String,
  tech: Schema.Number,
  integrity: Schema.Number,
  type: ItemType,
  min_damage: NullableNumber,
  max_damage: NullableNumber,
  min_heal: NullableNumber,
  max_heal: NullableNumber,
  damage_bonus: NullableNumber,
  hands: NullableNumber,
  reach: NullableNumber,
  hits_per_round: NullableNumber,
  item_prerequisite: Schema.Array(StatModifier),
  item_prerequisite_title: Schema.Array(TitlePrerequisite),
  item_prerequisite_implant: Schema.Array(ImplantPrerequisite),
  item_prerequisite_race: Schema.Array(RacePrerequisite),
  item_effect: Schema.Array(StatModifier),
});

export const Kit = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  tech: Schema.Number,
  type: ItemType,
  kit_effect: Schema.Array(StatModifier),
  kit_prerequisite: Schema.Array(StatModifier),
  kit_prerequisite_title: Schema.Array(TitlePrerequisite),
  kit_prerequisite_implant: Schema.Array(ImplantPrerequisite),
  kit_prerequisite_race: Schema.Array(RacePrerequisite),
});

export const Implant = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  level_max: Schema.Number,
  implant_attribute: Schema.Array(Schema.Struct({ attribute: StatProperty })),
  implant_value: Schema.Array(
    Schema.Struct({ level: Schema.Number, value: Schema.Number }),
  ),
});

export const Race = Schema.Struct({
  type: RaceType,
  strength: Schema.Number,
  agility: Schema.Number,
  robustness: Schema.Number,
  perception: Schema.Number,
  stealth: Schema.Number,
  computing: Schema.Number,
  medicine: Schema.Number,
  engineering: Schema.Number,
  health: Schema.Number,
  stamina: Schema.Number,
});

export const Title = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
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
