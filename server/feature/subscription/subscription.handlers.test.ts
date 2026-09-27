import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';

import type { Subscription, SubscriptionPlan } from './subscription.schema.js';
import { DbError } from '../../platform/db-error.js';
import {
  makeTestApi,
  TEST_USER_ID,
  VALID_TOKEN,
} from '../../testing/test-api.js';

const plan: SubscriptionPlan = {
  code: 'year',
  label: 'Un an',
  duration_ingame_years: 12,
  price_cents: 500,
  sort_order: 1,
};

const created: Array<{ plan: SubscriptionPlan; endsAt: string }> = [];

const request = makeTestApi({
  subscriptions: {
    activePlans: Effect.succeed([plan]),
    activePlan: (code) =>
      code === plan.code
        ? Effect.succeed(plan)
        : Effect.fail(new DbError({ code: 'PGRST116', message: '0 rows' })),
    listMine: Effect.succeed([]),
    create: (selected, range) =>
      Effect.sync((): Subscription => {
        created.push({ plan: selected, endsAt: range.endsAt });
        return {
          id: 'sub-1',
          user_id: TEST_USER_ID,
          plan_code: selected.code,
          plan_name: selected.label,
          price_cents: selected.price_cents,
          starts_at: range.startsAt,
          ends_at: range.endsAt,
          status: 'pending',
          validated_at: null,
          validated_by: null,
          created_at: range.startsAt,
        };
      }),
  },
});

const auth = { token: VALID_TOKEN };

describe('subscriptions', () => {
  it('lists the active plans to signed-in users only', async () => {
    expect((await request('/api/subscription-plans')).status).toBe(401);

    const response = await request('/api/subscription-plans', auth);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([plan]);
  });

  it('creates a pending subscription with 201', async () => {
    const response = await request('/api/subscriptions', {
      ...auth,
      method: 'POST',
      body: { planCode: 'year' },
    });

    expect(response.status).toBe(201);
    expect(response.headers.get('cache-control')).toBe(
      'no-store, no-cache, must-revalidate',
    );
    expect(await response.json()).toMatchObject({
      plan_code: 'year',
      status: 'pending',
    });
    expect(created).toHaveLength(1);
  });

  it('answers 400 for an unknown plan', async () => {
    const response = await request('/api/subscriptions', {
      ...auth,
      method: 'POST',
      body: { planCode: 'lifetime' },
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Plan abonnement introuvable.',
    });
  });

  it('answers 400 with the legacy message on an invalid payload', async () => {
    const response = await request('/api/subscriptions', {
      ...auth,
      method: 'POST',
      body: { planCode: '' },
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Payload abonnement invalide.',
    });
  });
});
