import { z } from '@hono/zod-openapi';
import { asc, eq } from 'drizzle-orm';

import type { CatalogRepo } from './catalog.repo.js';
import { Implant, Item, Kit, Race } from './catalog.schema.js';
import { withAnon, type Db } from '../../db/client.js';
import { decodeRows, single } from '../../db/rows.js';
import { drug, implant, item, kit, race, title } from '../../db/schema.js';

// Implant names are plain text in the database: validate them (and the
// bounds) against the contract. Parsing also drops the join columns the
// nested queries bring along.
const decodeItems = decodeRows(z.array(Item));
const decodeKits = decodeRows(z.array(Kit));
const decodeImplants = decodeRows(z.array(Implant));
const decodeRaces = decodeRows(z.array(Race));

const PROPERTY_VALUE = { columns: { property: true, value: true } } as const;
const IMPLANT_NAME = {
  columns: { implant_id: true },
  with: { implant: { columns: { name: true } } },
} as const;

const DRUG_QUERY = {
  columns: { id: true, name: true, image: true },
  with: { stat_modifier: PROPERTY_VALUE },
} as const;

export const makeCatalogRepo = (db: Db): CatalogRepo => ({
  items: () =>
    withAnon(db, async (tx) =>
      decodeItems(
        await tx.query.item.findMany({
          columns: {
            id: true,
            name: true,
            image: true,
            tech: true,
            integrity: true,
            type: true,
            min_damage: true,
            max_damage: true,
            min_heal: true,
            max_heal: true,
            damage_bonus: true,
            hands: true,
            reach: true,
            hits_per_round: true,
          },
          with: {
            item_prerequisite: PROPERTY_VALUE,
            item_prerequisite_title: { columns: { title_id: true } },
            item_prerequisite_implant: IMPLANT_NAME,
            item_prerequisite_race: { columns: { race: true } },
            item_effect: PROPERTY_VALUE,
          },
          orderBy: asc(item.name),
        }),
      ),
    ),
  kits: () =>
    withAnon(db, async (tx) =>
      decodeKits(
        await tx.query.kit.findMany({
          columns: { id: true, name: true, tech: true, type: true },
          with: {
            kit_effect: PROPERTY_VALUE,
            kit_prerequisite: PROPERTY_VALUE,
            kit_prerequisite_title: { columns: { title_id: true } },
            kit_prerequisite_implant: IMPLANT_NAME,
            kit_prerequisite_race: { columns: { race: true } },
          },
          orderBy: asc(kit.name),
        }),
      ),
    ),
  implants: () =>
    withAnon(db, async (tx) =>
      decodeImplants(
        await tx.query.implant.findMany({
          columns: { id: true, name: true, level_max: true },
          with: {
            implant_attribute: { columns: { attribute: true } },
            implant_value: { columns: { level: true, value: true } },
          },
          orderBy: asc(implant.id),
        }),
      ),
    ),
  races: () =>
    withAnon(db, async (tx) =>
      decodeRaces(
        await tx
          .select({
            type: race.type,
            strength: race.strength,
            agility: race.agility,
            robustness: race.robustness,
            perception: race.perception,
            stealth: race.stealth,
            computing: race.computing,
            medicine: race.medicine,
            engineering: race.engineering,
            health: race.health,
            stamina: race.stamina,
          })
          .from(race)
          .orderBy(asc(race.type)),
      ),
    ),
  titles: () =>
    withAnon(db, (tx) =>
      tx
        .select({ id: title.id, name: title.name })
        .from(title)
        .orderBy(asc(title.name)),
    ),
  drugs: () =>
    withAnon(db, (tx) =>
      tx.query.drug.findMany({ ...DRUG_QUERY, orderBy: asc(drug.id) }),
    ),
  drug: (id) =>
    withAnon(db, async (tx) =>
      single(
        await tx.query.drug.findMany({ ...DRUG_QUERY, where: eq(drug.id, id) }),
      ),
    ),
});
