import bcrypt from 'bcryptjs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { runAdminCommand, USAGE } from './admin.commands.js';
import {
  createPlan,
  createUser,
  makeTestDb,
  type TestDb,
} from '../db/testing/test-db.js';
import { makeAuthRepo } from '../feature/auth/auth.repo.postgres.js';
import { makeAuthService } from '../feature/auth/auth.service.live.js';

let testDb: TestDb;

beforeAll(async () => {
  testDb = await makeTestDb({ seed: false });
}, 60_000);

afterAll(() => testDb.close());

const run = (...argv: Array<string>) => runAdminCommand(testDb.db, argv);
const passwordOf = (lines: ReadonlyArray<string>) =>
  lines.join('\n').match(/assword(?: for \S+)?: (\S+)/)?.[1] ?? '';

describe('admin commands', () => {
  it('creates an account that can sign in with the printed password', async () => {
    const lines = await run('user:create', 'New@Example.com');
    const password = passwordOf(lines);

    expect(password).toHaveLength(16);
    const auth = makeAuthService(makeAuthRepo(testDb.db));
    const { user } = await auth.signIn('new@example.com', password);
    expect(user.email).toBe('new@example.com');
  });

  it('resets a password and signs the sessions out', async () => {
    const auth = makeAuthService(makeAuthRepo(testDb.db));
    const created = passwordOf(await run('user:create', 'reset@example.com'));
    const { token } = await auth.signIn('reset@example.com', created);

    const password = passwordOf(
      await run('user:password', 'RESET@example.com'),
    );

    expect(password).not.toBe(created);
    expect(await auth.resolve(token)).toBeNull();
    await expect(
      auth.signIn('reset@example.com', created),
    ).rejects.toMatchObject({ status: 401 });
    expect((await auth.signIn('reset@example.com', password)).user.email).toBe(
      'reset@example.com',
    );
    await expect(run('user:password', 'ghost@example.com')).rejects.toThrow(
      'No account ghost@example.com.',
    );
  });

  it('lists and validates pending subscriptions', async () => {
    await createPlan(testDb);
    const userId = await createUser(
      testDb,
      'buyer@example.com',
      {},
      bcrypt.hashSync('x', 4),
    );
    const { rows } = await testDb.admin.query<{ id: string }>(
      `INSERT INTO public.subscription (user_id, plan_code, plan_name, price_cents, starts_at, ends_at, status)
       VALUES ($1, 'month', 'Un mois', 1000, now(), now() + interval '30 days', 'pending') RETURNING id`,
      [userId],
    );
    const id = rows[0]?.id ?? '';

    expect((await run('subscription:pending')).join('\n')).toContain(
      `${id}  buyer@example.com  Un mois  10 crédits`,
    );
    expect((await run('subscription:validate', id))[0]).toMatch(
      new RegExp(`^Subscription ${id} validated, until .*\\+00:00\\.$`),
    );
    expect(await run('subscription:pending')).toEqual([
      'No pending subscription.',
    ]);
    await expect(run('subscription:validate', id)).rejects.toThrow(
      `No pending subscription ${id}.`,
    );
  });

  it('prints the usage on a wrong command', async () => {
    await expect(run('nope')).rejects.toThrow(USAGE);
    await expect(run('user:create')).rejects.toThrow(USAGE);
  });
});
