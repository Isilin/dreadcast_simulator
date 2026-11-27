import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeSubscriptionRepo } from './subscription.repo.postgres.js';
import {
  createPlan,
  createUser,
  makeTestDb,
  subscribe,
  userClaims,
  type TestDb,
} from '../../db/testing/test-db.js';

let testDb: TestDb;
let alice: string;
let bob: string;

beforeAll(async () => {
  testDb = await makeTestDb({ seed: false });
  await createPlan(testDb);
  alice = await createUser(testDb, 'alice@example.com');
  bob = await createUser(testDb, 'bob@example.com');
}, 60_000);

afterAll(() => testDb.close());

const subscriptionsOf = (userId: string) =>
  makeSubscriptionRepo(testDb.db)(userClaims(userId));

describe('subscription repository (Postgres)', () => {
  it('lists the active plans', async () => {
    const plan = {
      code: 'month',
      label: 'Un mois',
      duration_ingame_years: 1,
      price_cents: 1000,
      sort_order: 1,
    };
    expect(await subscriptionsOf(alice).activePlans()).toEqual([plan]);
    expect(await subscriptionsOf(alice).activePlan('month')).toEqual(plan);
    await expect(
      subscriptionsOf(alice).activePlan('unknown'),
    ).rejects.toMatchObject({ code: 'NO_ROWS' });
  });

  it('creates a pending subscription, not active yet', async () => {
    const repo = subscriptionsOf(alice);
    const [plan] = await repo.activePlans();
    if (!plan) {
      throw new Error('No plan');
    }

    const created = await repo.create(plan, {
      startsAt: '2026-11-27T00:00:00Z',
      endsAt: '2026-12-27T00:00:00Z',
    });

    expect(created).toMatchObject({
      user_id: alice,
      plan_code: 'month',
      status: 'pending',
      validated_at: null,
    });
    expect(created.created_at).toMatch(/T.*\+00:00$/);
    expect(await repo.listMine()).toEqual([created]);
    expect(await repo.hasActive()).toBe(false);
  });

  it('sees a validated subscription as active, for its owner only', async () => {
    await subscribe(testDb, bob);
    expect(await subscriptionsOf(bob).hasActive()).toBe(true);
    expect(await subscriptionsOf(bob).listMine()).toHaveLength(1);
    expect(
      (await subscriptionsOf(alice).listMine()).every(
        (row) => row.user_id === alice,
      ),
    ).toBe(true);
  });
});
