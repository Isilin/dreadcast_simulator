import { z } from '@hono/zod-openapi';

import type { CatalogRepo } from './catalog.repo.js';
import { Implant, Item, Kit, type Race } from './catalog.schema.js';
import {
  decodeRows,
  runQuery,
  type Supabase,
} from '../../platform/supabase.js';

// Implant names are plain text in the database: validate them (and the
// bounds) against the contract.
const decodeItems = decodeRows(z.array(Item));
const decodeKits = decodeRows(z.array(Kit));
const decodeImplants = decodeRows(z.array(Implant));

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

export const makeCatalogRepo = (supabase: Supabase): CatalogRepo => ({
  items: async () =>
    decodeItems(
      await runQuery(
        supabase
          .anon()
          .from('item')
          .select(ITEM_SELECT)
          .order('name', { ascending: true }),
      ),
    ),
  kits: async () =>
    decodeKits(
      await runQuery(
        supabase
          .anon()
          .from('kit')
          .select(KIT_SELECT)
          .order('name', { ascending: true }),
      ),
    ),
  implants: async () =>
    decodeImplants(
      await runQuery(
        supabase
          .anon()
          .from('implant')
          .select(IMPLANT_SELECT)
          .order('id', { ascending: true }),
      ),
    ),
  races: async () =>
    (await runQuery(
      supabase
        .anon()
        .from('race')
        .select(RACE_SELECT)
        .order('type', { ascending: true }),
    )) as ReadonlyArray<Race>,
  titles: () =>
    runQuery(
      supabase
        .anon()
        .from('title')
        .select('id, name')
        .order('name', { ascending: true }),
    ),
  drugs: () =>
    runQuery(
      supabase
        .anon()
        .from('drug')
        .select(DRUG_SELECT)
        .order('id', { ascending: true }),
    ),
  drug: (id) =>
    runQuery(
      supabase.anon().from('drug').select(DRUG_SELECT).eq('id', id).single(),
    ),
});
