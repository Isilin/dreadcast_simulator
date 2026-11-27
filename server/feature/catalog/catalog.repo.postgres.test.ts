import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeCatalogRepo } from './catalog.repo.postgres.js';
import { makeTestDb, type TestDb } from '../../db/testing/test-db.js';

let testDb: TestDb;

beforeAll(async () => {
  testDb = await makeTestDb();
}, 60_000);

afterAll(() => testDb.close());

describe('catalog repository (Postgres, seeded)', () => {
  it('reads every item with its nested prerequisites and effects', async () => {
    // The seeds have no implant prerequisite.
    const { rows } = await testDb.admin.query<{
      item_id: string;
      name: string;
    }>(`
      INSERT INTO public.item_prerequisite_implant (item_id, implant_id)
      SELECT (SELECT id FROM public.item ORDER BY id LIMIT 1), 3
      RETURNING item_id, (SELECT name FROM public.implant WHERE id = 3) AS name
    `);
    const [prerequisite] = rows;

    const items = await makeCatalogRepo(testDb.db).items();

    expect(items).toHaveLength(408);
    const names = items.map((item) => item.name);
    expect(names).toEqual(
      [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    );
    const withEffects = items.find((item) => item.item_effect.length > 0);
    expect(withEffects?.item_effect[0]).toEqual({
      property: expect.any(String),
      value: expect.any(Number),
    });
    expect(
      items.find((item) => item.id === prerequisite?.item_id)
        ?.item_prerequisite_implant,
    ).toEqual([{ implant: { name: prerequisite?.name } }]);
  });

  it('reads kits, implants (numeric values as numbers) and races', async () => {
    const catalog = makeCatalogRepo(testDb.db);

    expect(await catalog.kits()).toHaveLength(220);

    const implants = await catalog.implants();
    expect(implants).toHaveLength(30);
    expect(implants.map((implant) => implant.id)).toEqual(
      [...implants.map((implant) => implant.id)].sort((a, b) => a - b),
    );
    const withValues = implants.find((implant) => implant.implant_value.length);
    expect(typeof withValues?.implant_value[0]?.value).toBe('number');

    const races = await catalog.races();
    expect(races).toHaveLength(11);
    expect(races[0]?.type).toBe('Humain');
  });

  it('reads drugs, one drug, and fails on an unknown one', async () => {
    const catalog = makeCatalogRepo(testDb.db);
    const drugs = await catalog.drugs();
    expect(drugs).toHaveLength(9);

    const [first] = drugs;
    if (!first) {
      throw new Error('No drug');
    }
    expect(await catalog.drug(first.id)).toEqual(first);
    expect(first.stat_modifier[0]).toEqual({
      property: expect.any(String),
      value: expect.any(Number),
    });

    await expect(catalog.drug('unknown')).rejects.toMatchObject({
      code: 'NO_ROWS',
    });
    expect(await catalog.titles()).toEqual([]);
  });
});
