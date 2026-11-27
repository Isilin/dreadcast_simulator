import { eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { withAnon, withUser } from './client.js';
import { build, game_version } from './schema.js';
import { createUser, makeTestDb, type TestDb } from './testing/test-db.js';
import { isDbError } from '../platform/db-error.js';

let testDb: TestDb;
let alice: string;
let bob: string;

beforeAll(async () => {
  testDb = await makeTestDb();
  alice = await createUser(testDb, 'alice@example.com');
  bob = await createUser(testDb, 'bob@example.com');
}, 60_000);

afterAll(() => testDb.close());

const as = (userId: string) => ({ userId, appMetadata: {} });

describe('withAnon / withUser', () => {
  it('runs as the anon role without user', async () => {
    const row = await withAnon(testDb.db, async (tx) => {
      const result = await tx.execute<{ role: string; uid: string | null }>(
        sql`select current_user as role, auth.uid() as uid`,
      );
      return result.rows[0];
    });
    expect(row).toEqual({ role: 'anon', uid: null });
  });

  it('runs as the authenticated role with auth.uid()', async () => {
    const row = await withUser(testDb.db, as(alice), async (tx) => {
      const result = await tx.execute<{ role: string; uid: string }>(
        sql`select current_user as role, auth.uid() as uid`,
      );
      return result.rows[0];
    });
    expect(row).toEqual({ role: 'authenticated', uid: alice });
  });

  it('applies row level security: a user only sees their builds', async () => {
    await withUser(testDb.db, as(alice), (tx) =>
      tx.insert(build).values({ user_id: alice, snapshot: { v: 1 } }),
    );

    const mine = await withUser(testDb.db, as(alice), (tx) =>
      tx.select({ id: build.id }).from(build).where(eq(build.user_id, alice)),
    );
    const others = await withUser(testDb.db, as(bob), (tx) =>
      tx.select({ id: build.id }).from(build).where(eq(build.user_id, alice)),
    );

    expect(mine).toHaveLength(1);
    expect(others).toHaveLength(0);
  });

  it('refuses to write a row for someone else', async () => {
    const error = await withUser(testDb.db, as(bob), (tx) =>
      tx.insert(build).values({ user_id: alice, snapshot: {} }),
    ).catch((cause: unknown) => cause);

    expect(isDbError(error) && error.code).toBe('42501');
  });

  it('reads timestamps in their JSON form', async () => {
    const [row] = await withAnon(testDb.db, (tx) =>
      tx.select({ created_at: game_version.created_at }).from(game_version),
    );
    expect(row?.created_at).toMatch(
      /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?\+00:00$/,
    );
  });

  it('does not leak the claims into the next transaction', async () => {
    await withUser(testDb.db, as(alice), async () => undefined);
    const uid = await withAnon(testDb.db, async (tx) => {
      const result = await tx.execute<{ uid: string | null }>(
        sql`select auth.uid() as uid`,
      );
      return result.rows[0]?.uid;
    });
    expect(uid).toBeNull();
  });
});
