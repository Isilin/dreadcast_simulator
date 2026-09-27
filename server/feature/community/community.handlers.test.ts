import { Effect } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';

import type {
  PreviewRow,
  ReviewRow,
  SearchParams,
  SearchRow,
} from './community.rules.js';
import { STAT_KEYS } from './community.schema.js';
import { DbError } from '../../platform/db-error.js';
import {
  makeTestApi,
  TEST_USER_ID,
  VALID_TOKEN,
} from '../../testing/test-api.js';
import type { BuildRow } from '../build/build.rules.js';

const PUBLICATION_ID = '22222222-2222-4222-8222-222222222222';
const OTHER_ID = '33333333-3333-4333-8333-333333333333';
const AUTHOR_ID = '44444444-4444-4444-8444-444444444444';

const previewRow = (overrides: Partial<PreviewRow> = {}): PreviewRow => ({
  id: PUBLICATION_ID,
  title: 'Tank de base',
  description: null,
  specialization: 'tank',
  detected_specialization: 'tank',
  game_version: 'v15',
  race: 'Orc',
  gender: 'male',
  weapon_types: null,
  has_heal_weapon: false,
  key_stats: [{ stat: 'strength', value: '120.5' }],
  rating_count: 2,
  rating_avg: '4.50',
  published_at: '2026-09-01T00:00:00Z',
  content_updated_at: '2026-09-10T00:00:00Z',
  author_pseudo: 'Zoé',
  ...overrides,
});

const searchRow = (overrides: Partial<SearchRow> = {}): SearchRow => ({
  ...previewRow(),
  stats: { strength: 120.5 },
  is_mine: false,
  is_favorite: false,
  total_count: '1',
  ...overrides,
});

const zeroStats = () =>
  Object.fromEntries(STAT_KEYS.map((key) => [key, 0.123]));

// --- Mutable fake state, reset before each test ------------------------------

let subscriber = true;
let pseudo: string | null = 'Moi';
let searchRows: SearchRow[] = [];
let lastSearch: SearchParams | undefined;
let publishedStats: Readonly<Record<string, number>> | undefined;
let publishedDescription: string | null | undefined;
let header: { author_id: string; content_updated_at: string } | null = null;
let myReviewRow: ReviewRow | null = null;
let insertFails23505 = false;
let favoriteError: DbError | null = null;
let ownBuilds: BuildRow[] = [];
let insertedSnapshot: unknown;

beforeEach(() => {
  subscriber = true;
  pseudo = 'Moi';
  searchRows = [searchRow()];
  lastSearch = undefined;
  publishedStats = undefined;
  publishedDescription = undefined;
  header = { author_id: AUTHOR_ID, content_updated_at: '2026-09-10T00:00:00Z' };
  myReviewRow = null;
  insertFails23505 = false;
  favoriteError = null;
  ownBuilds = [{ id: 'b1', snapshot: {}, saved_at: '2026-01-01T00:00:00Z' }];
  insertedSnapshot = undefined;
});

const reviewRow = (overrides: Partial<ReviewRow> = {}): ReviewRow => ({
  id: 'r1',
  reviewer_id: TEST_USER_ID,
  stars: 4,
  body: null,
  created_at: '2026-09-05T00:00:00Z',
  updated_at: '2026-09-05T00:00:00Z',
  ...overrides,
});

const request = makeTestApi({
  subscriptions: { hasActive: Effect.sync(() => subscriber) },
  profile: {
    pseudo: Effect.sync(() => pseudo),
    pseudosOf: (ids) =>
      Effect.succeed(
        new Map(
          ids.filter((id) => id === 'r-known').map((id) => [id, 'Connu']),
        ),
      ),
  },
  builds: {
    listOrdered: Effect.sync(() => [...ownBuilds]),
    insert: (snapshot, savedAt) =>
      Effect.sync(() => {
        insertedSnapshot = snapshot;
        const row = { id: 'b-new', snapshot, saved_at: savedAt };
        ownBuilds.push(row);
        return row;
      }),
  },
  community: {
    gameVersions: Effect.succeed([
      { code: 'v14', label: 'V14', released_at: null, is_current: false },
      { code: 'v15', label: 'V15', released_at: null, is_current: true },
    ]),
    preview: (id) =>
      Effect.succeed(id === PUBLICATION_ID ? previewRow() : null),
    search: (params) =>
      Effect.sync(() => {
        lastSearch = params;
        const rows = params.ids
          ? searchRows.filter((row) => params.ids!.includes(row.id))
          : searchRows;
        return { rows, total: rows.length };
      }),
    publish: (payload, stats) =>
      Effect.sync(() => {
        publishedStats = stats;
        publishedDescription = payload.description;
        return PUBLICATION_ID;
      }),
    unpublish: (id) => Effect.succeed(id === PUBLICATION_ID ? [id] : []),
    content: (id) =>
      Effect.succeed(
        id === PUBLICATION_ID
          ? { snapshot: '{"name":"Tank"}', stats: { strength: 120.5 } }
          : null,
      ),
    title: (id) =>
      Effect.succeed(id === PUBLICATION_ID ? 'Tank de base' : null),
    header: () => Effect.sync(() => header),
    addFavorite: () =>
      favoriteError ? Effect.fail(favoriteError) : Effect.void,
    removeFavorite: () => Effect.void,
    similar: () =>
      Effect.succeed([
        { publication_id: OTHER_ID, similarity: 0.9 },
        { publication_id: PUBLICATION_ID, similarity: 0.8 },
      ]),
    forYou: () => Effect.succeed([]),
  },
  reviews: {
    mine: () => Effect.sync(() => myReviewRow),
    page: () =>
      Effect.succeed({
        rows: [
          reviewRow({ id: 'r1', reviewer_id: 'r-known' }),
          reviewRow({ id: 'r2', reviewer_id: 'r-gone' }),
        ],
        total: 2,
      }),
    update: (_, stars, body) =>
      Effect.sync(() =>
        myReviewRow ? (myReviewRow = { ...myReviewRow, stars, body }) : null,
      ),
    insert: (_, stars, body) =>
      insertFails23505
        ? Effect.sync(() => {
            // Another tab created it meanwhile.
            myReviewRow = reviewRow({ stars: 1 });
          }).pipe(
            Effect.andThen(
              Effect.fail(new DbError({ code: '23505', message: 'dup' })),
            ),
          )
        : Effect.sync(() => (myReviewRow = reviewRow({ stars, body }))),
    remove: () => Effect.void,
  },
});

const auth = { token: VALID_TOKEN };
const json = (response: Response) => response.json();

describe('GET /api/community/meta', () => {
  it('is public and cached', async () => {
    const response = await request('/api/community/meta');

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('public');
    expect(await json(response)).toMatchObject({ current_version: 'v15' });
  });
});

describe('GET /api/community/builds (search)', () => {
  it('requires a session', async () => {
    expect((await request('/api/community/builds')).status).toBe(401);
  });

  it('maps the rows and paginates', async () => {
    const response = await request(
      '/api/community/builds?page=2&pageSize=10',
      auth,
    );

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({
      total: 1,
      page: 2,
      page_size: 10,
      items: [
        {
          rating_avg: 4.5,
          key_stats: [{ stat: 'strength', value: 120.5 }],
          weapon_types: [],
        },
      ],
    });
    expect(lastSearch).toMatchObject({
      limit: 10,
      offset: 10,
      sort: 'trending',
    });
  });

  it('rejects invalid filters', async () => {
    const response = await request('/api/community/builds?spec=wizard', auth);

    expect(response.status).toBe(400);
    expect(await json(response)).toEqual({
      error: 'Filtres de recherche invalides.',
      code: 'INVALID_FILTERS',
    });
  });

  it('reserves advanced filters to subscribers', async () => {
    subscriber = false;
    const response = await request('/api/community/builds?favorites=1', auth);

    expect(response.status).toBe(403);
    expect(await json(response)).toMatchObject({
      code: 'SUBSCRIPTION_REQUIRED',
    });
  });
});

describe('POST /api/community/builds (publish)', () => {
  const payload = {
    slot: 1,
    title: 'Mon tank',
    description: '',
    specialization: 'tank',
    detected_specialization: 'tank',
    stats: zeroStats(),
  };

  it('publishes with rounded stats and an empty description as null', async () => {
    const response = await request('/api/community/builds', {
      ...auth,
      method: 'POST',
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(await json(response)).toEqual({ id: PUBLICATION_ID });
    expect(publishedStats?.strength).toBe(0.12);
    expect(publishedDescription).toBeNull();
  });

  it.each([
    [{ title: 'ab' }, 422, 'INVALID_TITLE'],
    [{ specialization: 'mage' }, 422, 'INVALID_SPECIALIZATION'],
    [{ stats: { strength: 1 } }, 422, 'INVALID_STATS'],
    [{ slot: 0 }, 400, 'INVALID_PAYLOAD'],
  ])('maps %o to its error code', async (override, status, code) => {
    const response = await request('/api/community/builds', {
      ...auth,
      method: 'POST',
      body: { ...payload, ...override },
    });

    expect(response.status).toBe(status);
    expect(await json(response)).toMatchObject({ code });
  });
});

describe('GET /api/community/builds/:id (detail)', () => {
  it('serves the locked preview to guests', async () => {
    const response = await request(`/api/community/builds/${PUBLICATION_ID}`);

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({
      locked: true,
      content: null,
      is_subscriber: false,
      summary: { stats: null, is_mine: false },
    });
  });

  it('rejects an invalid id, even for guests', async () => {
    const response = await request('/api/community/builds/not-a-uuid');

    expect(response.status).toBe(400);
    expect(await json(response)).toMatchObject({ code: 'INVALID_ID' });
  });

  it('answers 404 for an unknown publication', async () => {
    const response = await request(`/api/community/builds/${OTHER_ID}`);

    expect(response.status).toBe(404);
    expect(await json(response)).toMatchObject({
      code: 'PUBLICATION_NOT_FOUND',
    });
  });

  it('refuses an invalid session instead of falling back to guest', async () => {
    const response = await request(`/api/community/builds/${PUBLICATION_ID}`, {
      token: 'expired',
    });

    expect(response.status).toBe(401);
  });

  it('opens the content to signed-in subscribers', async () => {
    myReviewRow = reviewRow({ updated_at: '2026-09-01T00:00:00Z' });
    const response = await request(
      `/api/community/builds/${PUBLICATION_ID}`,
      auth,
    );

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({
      locked: false,
      is_subscriber: true,
      content: { snapshot: { name: 'Tank' } },
      my_review: { reviewer_pseudo: 'Moi', is_mine: true, outdated: true },
    });
  });
});

describe('publication management', () => {
  it('refuses to refresh without stats', async () => {
    const response = await request(`/api/community/builds/${PUBLICATION_ID}`, {
      ...auth,
      method: 'PUT',
      body: { title: 'Titre', specialization: 'tank', refresh: true },
    });

    expect(response.status).toBe(400);
    expect(await json(response)).toMatchObject({ code: 'INVALID_PAYLOAD' });
  });

  it('answers 404 when unpublishing a publication of someone else', async () => {
    const response = await request(`/api/community/builds/${OTHER_ID}`, {
      ...auth,
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
  });

  it('copies a publication into a new build', async () => {
    const response = await request(
      `/api/community/builds/${PUBLICATION_ID}/copy`,
      { ...auth, method: 'POST' },
    );

    expect(response.status).toBe(201);
    expect(await json(response)).toEqual({ slot: 2 });
    expect(insertedSnapshot).toMatchObject({ name: 'Tank de base (copie)' });
  });

  it('reserves copies to subscribers', async () => {
    subscriber = false;
    const response = await request(
      `/api/community/builds/${PUBLICATION_ID}/copy`,
      { ...auth, method: 'POST' },
    );

    expect(response.status).toBe(403);
  });
});

describe('reviews', () => {
  it('lists the reviews with the reviewer pseudos', async () => {
    const response = await request(
      `/api/community/builds/${PUBLICATION_ID}/reviews?page=abc`,
      auth,
    );

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({
      total: 2,
      page: 1,
      page_size: 20,
      items: [{ reviewer_pseudo: 'Connu' }, { reviewer_pseudo: 'Anonyme' }],
    });
  });

  it('lets the author read the reviews without subscription', async () => {
    subscriber = false;
    header = {
      author_id: TEST_USER_ID,
      content_updated_at: '2026-09-10T00:00:00Z',
    };
    const response = await request(
      `/api/community/builds/${PUBLICATION_ID}/reviews`,
      auth,
    );

    expect(response.status).toBe(200);
  });

  const saveReview = (body: unknown) =>
    request(`/api/community/builds/${PUBLICATION_ID}/review`, {
      ...auth,
      method: 'PUT',
      body,
    });

  it('creates the review of the user', async () => {
    const response = await saveReview({ stars: 5, body: ' Top ' });

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({ stars: 5, body: 'Top' });
  });

  it('falls back to an update when another tab created it', async () => {
    insertFails23505 = true;
    const response = await saveReview({ stars: 3 });

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({ stars: 3 });
  });

  it.each([
    [
      'SELF_REVIEW',
      () => (header = { author_id: TEST_USER_ID, content_updated_at: '' }),
    ],
    ['SUBSCRIPTION_REQUIRED', () => (subscriber = false)],
    ['PSEUDO_REQUIRED', () => (pseudo = null)],
  ])('refuses with %s', async (code, arrange) => {
    arrange();
    const response = await saveReview({ stars: 4 });

    expect(response.status).toBe(403);
    expect(await json(response)).toMatchObject({ code });
  });

  it('rejects an invalid rating', async () => {
    const response = await saveReview({ stars: 6 });

    expect(response.status).toBe(422);
    expect(await json(response)).toMatchObject({ code: 'INVALID_REVIEW' });
  });
});

describe('favorites', () => {
  const addFavorite = () =>
    request(`/api/community/builds/${PUBLICATION_ID}/favorite`, {
      ...auth,
      method: 'PUT',
    });

  it('ignores a favorite that already exists', async () => {
    favoriteError = new DbError({ code: '23505', message: 'dup' });
    const response = await addFavorite();

    expect(response.status).toBe(200);
    expect(await json(response)).toEqual({ is_favorite: true });
  });

  it('answers 404 for a publication that no longer exists', async () => {
    favoriteError = new DbError({ code: '23503', message: 'fk' });
    const response = await addFavorite();

    expect(response.status).toBe(404);
    expect(await json(response)).toMatchObject({
      code: 'PUBLICATION_NOT_FOUND',
    });
  });
});

describe('recommendations', () => {
  it('keeps the similarity order', async () => {
    searchRows = [
      searchRow({ id: PUBLICATION_ID }),
      searchRow({ id: OTHER_ID, title: 'Autre' }),
    ];
    const response = await request('/api/community/similar', {
      ...auth,
      method: 'POST',
      body: { stats: zeroStats() },
    });

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({
      strategy: 'similar',
      items: [{ id: OTHER_ID }, { id: PUBLICATION_ID }],
    });
  });

  it('falls back to trending builds of others without signal', async () => {
    searchRows = [
      searchRow({ id: PUBLICATION_ID, is_mine: true }),
      searchRow({ id: OTHER_ID }),
    ];
    const response = await request('/api/community/for-you', auth);

    // Arrays in toMatchObject must have the same length.
    expect(await json(response)).toMatchObject({
      strategy: 'trending',
      items: [{ id: OTHER_ID, similarity: null }],
    });
  });

  it('maps a database community code', async () => {
    const failing = makeTestApi({
      subscriptions: { hasActive: Effect.succeed(true) },
      community: {
        forYou: () =>
          Effect.fail(new DbError({ code: 'P0001', message: 'FROZEN' })),
      },
    });
    const response = await failing('/api/community/for-you', auth);

    expect(response.status).toBe(403);
    expect(await json(response)).toMatchObject({ code: 'FROZEN' });
  });
});
