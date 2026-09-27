import { Context, Effect, Layer } from 'effect';

import type {
  Drug,
  Implant,
  Item,
  Kit,
  Race,
  Title,
} from './catalog.schema.js';
import type { DbError } from '../../platform/db-error.js';
import { runQuery, Supabase } from '../../platform/supabase.js';

const ITEM_SELECT = `
  id,
  name,
  image,
  tech,
  integrity,
  type,
  min_damage,
  max_damage,
  min_heal,
  max_heal,
  damage_bonus,
  hands,
  reach,
  hits_per_round,
  item_prerequisite (
    property,
    value
  ),
  item_prerequisite_title (
    title_id
  ),
  item_prerequisite_implant (
    implant (
      name
    )
  ),
  item_prerequisite_race (
    race
  ),
  item_effect (
    property,
    value
  )
`;

const KIT_SELECT = `
  id,
  name,
  tech,
  type,
  kit_effect (
    property,
    value
  ),
  kit_prerequisite (
    property,
    value
  ),
  kit_prerequisite_title (
    title_id
  ),
  kit_prerequisite_implant (
    implant (
      name
    )
  ),
  kit_prerequisite_race (
    race
  )
`;

const IMPLANT_SELECT = `
  id,
  name,
  level_max,
  implant_attribute (
    attribute
  ),
  implant_value (
    level,
    value
  )
`;

const RACE_SELECT = `
  type,
  strength,
  agility,
  robustness,
  perception,
  stealth,
  computing,
  medicine,
  engineering,
  health,
  stamina
`;

const DRUG_SELECT = `
  id,
  name,
  image,
  stat_modifier (
    property,
    value
  )
`;

export class CatalogRepo extends Context.Service<
  CatalogRepo,
  {
    readonly items: Effect.Effect<ReadonlyArray<Item>, DbError>;
    readonly kits: Effect.Effect<ReadonlyArray<Kit>, DbError>;
    readonly implants: Effect.Effect<ReadonlyArray<Implant>, DbError>;
    readonly races: Effect.Effect<ReadonlyArray<Race>, DbError>;
    readonly titles: Effect.Effect<ReadonlyArray<Title>, DbError>;
    readonly drugs: Effect.Effect<ReadonlyArray<Drug>, DbError>;
    /** Fails with PGRST116 when the drug does not exist. */
    readonly drug: (id: string) => Effect.Effect<Drug, DbError>;
  }
>()('server/CatalogRepo') {
  static readonly layer = Layer.effect(
    CatalogRepo,
    Effect.gen(function* () {
      const supabase = yield* Supabase;

      return {
        items: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('item')
              .select(ITEM_SELECT)
              .order('name', { ascending: true }),
          ),
        ),
        kits: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('kit')
              .select(KIT_SELECT)
              .order('name', { ascending: true }),
          ),
        ),
        implants: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('implant')
              .select(IMPLANT_SELECT)
              .order('id', { ascending: true }),
          ),
        ),
        races: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('race')
              .select(RACE_SELECT)
              .order('type', { ascending: true }),
          ),
        ),
        titles: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('title')
              .select('id, name')
              .order('name', { ascending: true }),
          ),
        ),
        drugs: Effect.suspend(() =>
          runQuery(
            supabase
              .anon()
              .from('drug')
              .select(DRUG_SELECT)
              .order('id', { ascending: true }),
          ),
        ),
        drug: (id) =>
          Effect.suspend(() =>
            runQuery(
              supabase
                .anon()
                .from('drug')
                .select(DRUG_SELECT)
                .eq('id', id)
                .single(),
            ),
          ),
      };
    }),
  );
}
