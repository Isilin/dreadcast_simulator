import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeBuildRepo } from './build.repo.postgres.js';
import {
  createUser,
  makeTestDb,
  userClaims,
  type TestDb,
} from '../../db/testing/test-db.js';

let testDb: TestDb;
let alice: string;
let bob: string;

beforeAll(async () => {
  testDb = await makeTestDb({ seed: false });
  alice = await createUser(testDb, 'alice@example.com');
  bob = await createUser(testDb, 'bob@example.com');
}, 60_000);

afterAll(() => testDb.close());

describe('build repository (Postgres)', () => {
  it('inserts, lists by creation, updates and removes builds', async () => {
    const builds = makeBuildRepo(testDb.db)(userClaims(alice));

    const first = await builds.insert({ name: 'one' }, '2026-11-01T10:00:00Z');
    const second = await builds.insert({ name: 'two' }, '2026-11-02T10:00:00Z');
    expect(first).toEqual({
      id: expect.any(String),
      snapshot: { name: 'one' },
      saved_at: '2026-11-01T10:00:00+00:00',
    });

    expect((await builds.listOrdered()).map((row) => row.id)).toEqual([
      first.id,
      second.id,
    ]);

    const updated = await builds.update(
      first.id,
      { name: 'one bis' },
      '2026-11-03T10:00:00.5Z',
    );
    expect(updated).toEqual({
      id: first.id,
      snapshot: { name: 'one bis' },
      saved_at: '2026-11-03T10:00:00.5+00:00',
    });

    expect(await builds.remove(second.id)).toEqual([second.id]);
    expect((await builds.listOrdered()).map((row) => row.id)).toEqual([
      first.id,
    ]);
  });

  it("does not touch another user's builds", async () => {
    const aliceBuilds = makeBuildRepo(testDb.db)(userClaims(alice));
    const bobBuilds = makeBuildRepo(testDb.db)(userClaims(bob));
    const build = await aliceBuilds.insert({}, '2026-11-01T10:00:00Z');

    expect(await bobBuilds.listOrdered()).toEqual([]);
    expect(await bobBuilds.remove(build.id)).toEqual([]);
    await expect(
      bobBuilds.update(build.id, {}, '2026-11-01T10:00:00Z'),
    ).rejects.toMatchObject({ code: 'NO_ROWS' });
  });
});
