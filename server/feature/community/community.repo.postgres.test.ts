import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  makeCommunityPublicRepo,
  makeCommunityRepo,
  makeReviewRepo,
} from './community.repo.postgres.js';
import type { PublishPayload } from './community.schema.js';
import {
  createPlan,
  createUser,
  makeTestDb,
  subscribe,
  userClaims,
  type TestDb,
} from '../../db/testing/test-db.js';
import { makeBuildRepo } from '../build/build.repo.postgres.js';
import { makeProfileRepo } from '../profile/profile.repo.postgres.js';

const ISO_UTC = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?\+00:00$/;

const STAT_KEYS = [
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
];
const STATS = Object.fromEntries(
  STAT_KEYS.map((key, index) => [key, 100 + index]),
);

let testDb: TestDb;
let alice: string; // author
let bob: string; // subscribed reader
let carol: string; // signed in, no subscription
let weaponId: string;
let publicationId: string;

const community = (userId: string) =>
  makeCommunityRepo(testDb.db)(userClaims(userId));
const reviews = (userId: string) =>
  makeReviewRepo(testDb.db)(userClaims(userId));

beforeAll(async () => {
  testDb = await makeTestDb();
  await createPlan(testDb);
  alice = await createUser(testDb, 'alice@example.com');
  bob = await createUser(testDb, 'bob@example.com');
  carol = await createUser(testDb, 'carol@example.com');
  for (const [userId, pseudo] of [
    [alice, 'Alice'],
    [bob, 'Bob'],
  ] as const) {
    await subscribe(testDb, userId);
    await makeProfileRepo(testDb.db)(userClaims(userId)).createPseudo(pseudo);
  }

  const { rows } = await testDb.admin.query<{ id: string }>(
    "SELECT id FROM public.item WHERE type = '1handShot' ORDER BY id LIMIT 1",
  );
  weaponId = rows[0]?.id ?? '';
  await makeBuildRepo(testDb.db)(userClaims(alice)).insert(
    {
      profile: { race: 'Humain', gender: 'female' },
      items: { rightArm: { id: weaponId } },
      kits: {},
      implants: {},
      drug: null,
    },
    '2026-11-27T10:00:00Z',
  );
}, 60_000);

afterAll(() => testDb.close());

const PAYLOAD: PublishPayload = {
  slot: 1,
  title: 'Tireuse de test',
  description: null,
  specialization: 'tireur',
  detected_specialization: 'tireur',
  stats: STATS,
};

describe('community repository (Postgres)', () => {
  it('publishes a build of the author', async () => {
    publicationId = await community(alice).publish(PAYLOAD, STATS);
    expect(publicationId).toMatch(/^[0-9a-f-]{36}$/);

    await expect(
      community(alice).publish(PAYLOAD, STATS),
    ).rejects.toMatchObject({ message: 'ALREADY_PUBLISHED' });
    await expect(
      community(carol).publish(PAYLOAD, STATS),
    ).rejects.toMatchObject({ message: 'SUBSCRIPTION_REQUIRED' });
  });

  it('shows the public preview and the game versions to visitors', async () => {
    const publicRepo = makeCommunityPublicRepo(testDb.db);
    const preview = await publicRepo.preview(publicationId);

    expect(preview).toMatchObject({
      id: publicationId,
      title: 'Tireuse de test',
      race: 'Humain',
      gender: 'female',
      weapon_types: ['1handShot'],
      author_pseudo: 'Alice',
      rating_count: 0,
      rating_avg: null,
    });
    expect(preview?.published_at).toMatch(ISO_UTC);
    expect(preview?.key_stats?.[0]).toEqual({
      stat: 'perception',
      value: STATS.perception,
    });
    expect(
      await publicRepo.preview('00000000-0000-4000-8000-000000000000'),
    ).toBeNull();

    expect(await publicRepo.gameVersions()).toEqual([
      {
        code: 'v15',
        label: 'Version 15',
        released_at: null,
        is_current: true,
      },
    ]);
  });

  it('finds the publication with search, with JSON values', async () => {
    const { rows, total } = await community(bob).search({
      limit: 24,
      offset: 0,
    });
    expect(total).toBe(1);
    expect(rows[0]).toMatchObject({
      id: publicationId,
      is_mine: false,
      is_favorite: false,
      total_count: 1,
    });

    const filtered = await community(bob).search({
      races: ['Elfe'],
      weaponTypes: ['1handShot'],
      statMin: { perception: 1 },
      itemIds: [weaponId],
      limit: 24,
      offset: 0,
    });
    expect(filtered).toEqual({ rows: [], total: 0 });

    const byItem = await community(bob).search({
      itemIds: [weaponId],
      query: 'tireuse',
      limit: 24,
      offset: 0,
    });
    expect(byItem.total).toBe(1);
  });

  it('lists the publications of the author', async () => {
    const mine = await community(alice).mine();
    expect(mine).toEqual([
      expect.objectContaining({
        id: publicationId,
        source_build_id: expect.any(String),
      }),
    ]);
    expect(await community(bob).mine()).toEqual([]);
  });

  it('keeps the content for subscribers (row level security)', async () => {
    const content = await community(bob).content(publicationId);
    expect(content?.stats).toEqual(STATS);
    expect(content?.snapshot).toMatchObject({ profile: { race: 'Humain' } });

    expect(await community(carol).content(publicationId)).toBeNull();
    expect(await community(carol).title(publicationId)).toBe('Tireuse de test');
    expect(await community(carol).header(publicationId)).toEqual({
      author_id: alice,
      content_updated_at: expect.stringMatching(ISO_UTC),
    });
  });

  it('adds and removes a favorite', async () => {
    await community(bob).addFavorite(publicationId);
    await expect(
      community(bob).addFavorite(publicationId),
    ).rejects.toMatchObject({ code: '23505' });
    await expect(
      community(bob).addFavorite('00000000-0000-4000-8000-000000000000'),
    ).rejects.toMatchObject({ code: '23503' });

    const favorites = await community(bob).search({
      favoritesOnly: true,
      limit: 24,
      offset: 0,
    });
    expect(favorites.rows[0]?.is_favorite).toBe(true);

    await community(bob).removeFavorite(publicationId);
    expect(
      (
        await community(bob).search({
          favoritesOnly: true,
          limit: 24,
          offset: 0,
        })
      ).total,
    ).toBe(0);
  });

  it('writes, pages, updates and removes a review', async () => {
    expect(await reviews(bob).mine(publicationId)).toBeNull();
    expect(await reviews(bob).update(publicationId, 3, null)).toBeNull();

    const review = await reviews(bob).insert(publicationId, 4, 'Bien');
    expect(review).toMatchObject({ reviewer_id: bob, stars: 4, body: 'Bien' });
    expect(review.created_at).toMatch(ISO_UTC);
    await expect(
      reviews(bob).insert(publicationId, 5, null),
    ).rejects.toMatchObject({ code: '23505' });

    expect(await reviews(alice).page(publicationId, 0, 10)).toEqual({
      rows: [review],
      total: 1,
    });
    expect(await reviews(alice).page(publicationId, 10, 10)).toEqual({
      rows: [],
      total: 1,
    });

    const updated = await reviews(bob).update(publicationId, 5, null);
    expect(updated).toMatchObject({ id: review.id, stars: 5, body: null });
    expect(
      (await makeCommunityPublicRepo(testDb.db).preview(publicationId))
        ?.rating_avg,
    ).toBe(5);

    await reviews(bob).remove(publicationId);
    expect(await reviews(bob).mine(publicationId)).toBeNull();
  });

  it('recommends similar publications', async () => {
    const similar = await community(bob).similar({ stats: STATS }, STATS, 5);
    expect(similar).toEqual([
      { publication_id: publicationId, similarity: expect.any(Number) },
    ]);
    expect(
      await community(bob).similar(
        { stats: STATS, exclude_ids: [publicationId] },
        STATS,
        5,
      ),
    ).toEqual([]);
    expect(Array.isArray(await community(bob).forYou(5))).toBe(true);
  });

  it('updates then unpublishes, for the author only', async () => {
    await community(alice).update(
      publicationId,
      { ...PAYLOAD, title: 'Tireuse renommee' },
      undefined,
    );
    expect(await community(bob).title(publicationId)).toBe('Tireuse renommee');

    expect(await community(bob).unpublish(publicationId)).toEqual([]);
    expect(await community(alice).unpublish(publicationId)).toEqual([
      publicationId,
    ]);
    expect(await community(alice).mine()).toEqual([]);
  });
});
