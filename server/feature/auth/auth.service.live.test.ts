import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeAuthRepo } from './auth.repo.postgres.js';
import { hashToken, makeAuthService } from './auth.service.live.js';
import { withUser } from '../../db/client.js';
import {
  createUser,
  makeTestDb,
  userClaims,
  type TestDb,
} from '../../db/testing/test-db.js';
import { makeFailureLimiter } from '../../platform/rate-limit.js';

const DAY_MS = 24 * 60 * 60 * 1000;

let testDb: TestDb;
let zoeId: string;

beforeAll(async () => {
  testDb = await makeTestDb({ seed: false });
  // Cost 4: the tests check the flow, not bcrypt's slowness ($2a$, as
  // Supabase wrote them).
  const hash = bcrypt.hashSync('secret', 4).replace(/^\$2b\$/, '$2a$');
  zoeId = await createUser(testDb, 'zoe@example.com', { role: 'admin' }, hash);
  await createUser(testDb, 'nopass@example.com');
}, 60_000);

afterAll(() => testDb.close());

const sessionRows = async () =>
  (
    await testDb.admin.query<{ token_hash: string; expires_at: string }>(
      'SELECT token_hash, expires_at::text FROM private.session ORDER BY created_at',
    )
  ).rows;

const service = (now = () => new Date()) =>
  makeAuthService(makeAuthRepo(testDb.db), {
    now,
    limiter: makeFailureLimiter({ max: 3, windowMs: 60_000 }),
  });

describe('auth service (Postgres)', () => {
  it('signs in with the stored bcrypt hash, case-insensitive email', async () => {
    const { token, user } = await service().signIn('ZOE@example.com', 'secret');

    expect(user).toEqual({
      userId: zoeId,
      email: 'zoe@example.com',
      appMetadata: { role: 'admin' },
    });
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const rows = await sessionRows();
    expect(rows.map((row) => row.token_hash)).toContain(hashToken(token));
    expect(JSON.stringify(rows)).not.toContain(token);
  });

  it('resolves a live session, and only that', async () => {
    const auth = service();
    const { token } = await auth.signIn('zoe@example.com', 'secret');

    expect((await auth.resolve(token))?.userId).toBe(zoeId);
    expect(await auth.resolve('unknown-token')).toBeNull();

    await auth.signOut(token);
    expect(await auth.resolve(token)).toBeNull();
  });

  it('refuses wrong passwords, unknown emails and accounts without password', async () => {
    const auth = service();
    for (const [email, password] of [
      ['zoe@example.com', 'wrong'],
      ['ghost@example.com', 'secret'],
      ['nopass@example.com', ''],
    ] as const) {
      await expect(auth.signIn(email, password)).rejects.toMatchObject({
        status: 401,
        message: 'Identifiants invalides.',
      });
    }
  });

  it('blocks an email after too many failures, even with the right password', async () => {
    const auth = service();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await expect(
        auth.signIn('zoe@example.com', 'wrong'),
      ).rejects.toMatchObject({ status: 401 });
    }
    await expect(
      auth.signIn('zoe@example.com', 'secret'),
    ).rejects.toMatchObject({ status: 429 });
  });

  it('ends a session after 30 days, and extends it while used', async () => {
    let now = new Date();
    const auth = service(() => now);
    const { token } = await auth.signIn('zoe@example.com', 'secret');

    // Two days later, the session is used: its end moves 30 days ahead.
    now = new Date(now.getTime() + 2 * DAY_MS);
    expect(await auth.resolve(token)).not.toBeNull();
    const [extended] = (
      await testDb.admin.query<{ days: number }>(
        'SELECT round(extract(epoch FROM expires_at - now()) / 86400) AS days FROM private.session WHERE token_hash = $1',
        [hashToken(token)],
      )
    ).rows;
    expect(Number(extended?.days)).toBe(32);

    await testDb.admin.query(
      "UPDATE private.session SET expires_at = now() - interval '1 minute' WHERE token_hash = $1",
      [hashToken(token)],
    );
    expect(await auth.resolve(token)).toBeNull();
  });

  it('keeps the sessions out of reach of the API roles', async () => {
    const error = await withUser(testDb.db, userClaims(zoeId), (tx) =>
      tx.execute(sql`select count(*) from private.session`),
    ).catch((cause: unknown) => cause);

    expect(error).toMatchObject({ code: '42501' });
  });
});
