import { Effect } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';

import type { BuildRow } from './build.rules.js';
import { DbError } from '../../platform/db-error.js';
import { makeTestApi, VALID_TOKEN } from '../../testing/test-api.js';

let rows: BuildRow[] = [];
let refuseDeletion = false;

beforeEach(() => {
  rows = [
    { id: 'a', snapshot: { name: 'first' }, saved_at: '2026-01-01T00:00:00Z' },
    // Legacy rows stored the snapshot as a JSON string.
    { id: 'b', snapshot: '{"name":"second"}', saved_at: '2026-01-02T00:00:00Z' },
  ];
  refuseDeletion = false;
});

const request = makeTestApi({
  builds: {
    // A copy, like a fresh query result.
    listOrdered: Effect.sync(() => [...rows]),
    update: (id, snapshot, savedAt) =>
      Effect.sync(() => {
        const row = rows.find((candidate) => candidate.id === id)!;
        row.snapshot = snapshot;
        row.saved_at = savedAt;
        return row;
      }),
    insert: (snapshot, savedAt) =>
      Effect.sync(() => {
        const row = { id: `new-${rows.length}`, snapshot, saved_at: savedAt };
        rows.push(row);
        return row;
      }),
    remove: (id) =>
      refuseDeletion
        ? Effect.succeed([])
        : id === 'boom'
          ? Effect.fail(new DbError({ message: 'db down' }))
          : Effect.sync(() => {
              rows = rows.filter((row) => row.id !== id);
              return [id];
            }),
  },
});

const auth = { token: VALID_TOKEN };

describe('authentication', () => {
  it('rejects a request without Authorization', async () => {
    const response = await request('/api/builds');

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Utilisateur non authentifie.',
    });
  });

  it('rejects a non-bearer Authorization', async () => {
    const response = await request('/api/builds', { authorization: 'Basic x' });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Jeton d'authentification invalide.",
    });
  });

  it('rejects a token Supabase does not accept', async () => {
    const response = await request('/api/builds', { token: 'expired' });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Utilisateur non authentifie.',
    });
  });

  it('checks the session before the payload', async () => {
    const response = await request('/api/builds', {
      method: 'PUT',
      body: { slot: 'nope' },
    });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/builds', () => {
  it('numbers the builds by creation order, never cached', async () => {
    const response = await request('/api/builds', auth);

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(response.headers.get('pragma')).toBe('no-cache');
    expect(await response.json()).toEqual([
      { slot: 1, snapshot: { name: 'first' }, saved_at: '2026-01-01T00:00:00Z' },
      { slot: 2, snapshot: { name: 'second' }, saved_at: '2026-01-02T00:00:00Z' },
    ]);
  });
});

describe('PUT /api/builds', () => {
  it('updates the build of an existing slot', async () => {
    const response = await request('/api/builds', {
      ...auth,
      method: 'PUT',
      body: { slot: 2, snapshot: { name: 'renamed' } },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      slot: 2,
      snapshot: { name: 'renamed' },
    });
    expect(rows).toHaveLength(2);
  });

  it('creates a build on the next slot', async () => {
    const response = await request('/api/builds', {
      ...auth,
      method: 'PUT',
      body: { slot: 7, snapshot: { name: 'third' } },
    });

    expect(await response.json()).toMatchObject({
      slot: 3,
      snapshot: { name: 'third' },
    });
  });

  it('answers 400 with the legacy message on an invalid payload', async () => {
    const response = await request('/api/builds', {
      ...auth,
      method: 'PUT',
      body: { slot: 0, snapshot: {} },
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Payload build invalide.' });
  });
});

describe('DELETE /api/builds', () => {
  it('deletes the build of the slot', async () => {
    const response = await request('/api/builds?slot=1', {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(rows.map((row) => row.id)).toEqual(['b']);
  });

  it('rejects an invalid slot', async () => {
    const response = await request('/api/builds?slot=abc', {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Slot de build invalide.' });
  });

  it('answers 404 for an empty slot', async () => {
    const response = await request('/api/builds?slot=5', {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Build introuvable.' });
  });

  it('answers 403 when row level security skips the row', async () => {
    refuseDeletion = true;
    const response = await request('/api/builds?slot=1', {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: 'Suppression du build refusée.',
    });
  });

  it('answers 500 with the database message', async () => {
    rows[0].id = 'boom';
    const response = await request('/api/builds?slot=1', {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'db down' });
  });
});
