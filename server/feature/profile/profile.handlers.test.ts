import { Effect } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';

import { DbError } from '../../platform/db-error.js';
import { makeTestApi, VALID_TOKEN } from '../../testing/test-api.js';

let currentPseudo: string | null = null;
let insertError: DbError | null = null;

beforeEach(() => {
  currentPseudo = null;
  insertError = null;
});

const request = makeTestApi({
  profile: {
    pseudo: Effect.sync(() => currentPseudo),
    createPseudo: (pseudo) =>
      insertError
        ? Effect.fail(insertError)
        : Effect.sync(() => {
            currentPseudo = pseudo;
            return pseudo;
          }),
  },
});

const setPseudo = (pseudo: unknown) =>
  request('/api/profile/me', {
    token: VALID_TOKEN,
    method: 'PUT',
    body: { pseudo },
  });

describe('GET /api/profile/me', () => {
  it('returns null until a pseudo is chosen', async () => {
    const response = await request('/api/profile/me', { token: VALID_TOKEN });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ pseudo: null });
  });
});

describe('PUT /api/profile/me', () => {
  it('creates the trimmed pseudo with 201', async () => {
    const response = await setPseudo('  Néo_Kobold  ');

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ pseudo: 'Néo_Kobold' });
  });

  it('refuses to change an existing pseudo', async () => {
    currentPseudo = 'Zoé';
    const response = await setPseudo('Autre');

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: 'Le pseudo est definitif et deja choisi.',
      code: 'PSEUDO_ALREADY_SET',
    });
  });

  it('rejects a reserved pseudo with the community error', async () => {
    const response = await setPseudo('admin');

    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ code: 'INVALID_PSEUDO' });
  });

  it('maps a unique violation to PSEUDO_TAKEN', async () => {
    insertError = new DbError({
      code: '23505',
      message:
        'duplicate key value violates unique constraint "user_profile_pseudo_key"',
    });
    const response = await setPseudo('Pris');

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'PSEUDO_TAKEN' });
  });

  it('maps a primary key violation to PSEUDO_ALREADY_SET', async () => {
    insertError = new DbError({
      code: '23505',
      message:
        'duplicate key value violates unique constraint "user_profile_pkey"',
    });
    const response = await setPseudo('Concurrent');

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'PSEUDO_ALREADY_SET' });
  });
});
