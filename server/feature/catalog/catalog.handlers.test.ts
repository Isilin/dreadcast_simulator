import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { afterAll, describe, expect, it } from 'vitest';

import { CatalogRepo } from './catalog.repo.js';
import type { Drug, Race } from './catalog.schema.js';
import { makeApiLayer } from '../../api.layer.js';
import { DbError } from '../../platform/db-error.js';

const caducee: Drug = {
  id: '0',
  name: 'Caducée',
  image: '/assets/drugs/caducee.webp',
  stat_modifier: [{ property: 'medicine', value: 20 }],
};

const human: Race = {
  type: 'Humain',
  strength: 100,
  agility: 100,
  robustness: 100,
  perception: 100,
  stealth: 100,
  computing: 100,
  medicine: 100,
  engineering: 100,
  health: 480,
  stamina: 100,
};

const FakeCatalogRepo = Layer.succeed(CatalogRepo, {
  items: Effect.succeed([]),
  kits: Effect.succeed([]),
  implants: Effect.fail(new DbError({ message: 'connection lost' })),
  races: Effect.succeed([human]),
  titles: Effect.succeed([]),
  drugs: Effect.succeed([caducee]),
  drug: (id) =>
    id === caducee.id
      ? Effect.succeed(caducee)
      : Effect.fail(new DbError({ code: 'PGRST116', message: '0 rows' })),
});

const { handler, dispose } = HttpRouter.toWebHandler(
  makeApiLayer(FakeCatalogRepo),
  { disableLogger: true },
);

afterAll(dispose);

const get = (path: string) => handler(new Request(`http://api.test${path}`));

describe('catalog', () => {
  it('serves reference data with the public cache policy', async () => {
    const response = await get('/api/races');

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=3600, stale-while-revalidate=86400',
    );
    expect(await response.json()).toEqual([human]);
  });

  it('returns one drug with ?id=', async () => {
    const response = await get('/api/drugs?id=0');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(caducee);
  });

  it('returns the list when ?id= is blank', async () => {
    const response = await get('/api/drugs?id=%20');

    expect(await response.json()).toEqual([caducee]);
  });

  it('answers 404 with the legacy body for an unknown drug', async () => {
    const response = await get('/api/drugs?id=unknown');

    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBeNull();
    expect(await response.json()).toEqual({ error: 'Drug not found' });
  });

  it('answers 500 with the database message', async () => {
    const response = await get('/api/implants');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'connection lost' });
  });
});
