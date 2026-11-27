import { z } from '@hono/zod-openapi';

import type { SubscriptionRepo } from './subscription.repo.js';
import { Subscription } from './subscription.schema.js';
import type { User } from '../../platform/auth.js';
import { decodeRows, runQuery } from '../../platform/supabase.js';

// The status is plain text in the database: validate the rows against the
// contract.
const decodeSubscriptions = decodeRows(z.array(Subscription));
const decodeSubscription = decodeRows(Subscription);

const SUBSCRIPTION_SELECT = `
  id,
  user_id,
  plan_code,
  plan_name,
  price_cents,
  starts_at,
  ends_at,
  status,
  validated_at,
  validated_by,
  created_at
`;

const SUBSCRIPTION_PLAN_SELECT = `
  code,
  label,
  duration_ingame_years,
  price_cents,
  sort_order
`;

export const makeSubscriptionRepo = ({
  supabase,
  userId,
}: User): SubscriptionRepo => ({
  activePlans: () =>
    runQuery(
      supabase
        .from('subscription_plan')
        .select(SUBSCRIPTION_PLAN_SELECT)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ),
  activePlan: (code) =>
    runQuery(
      supabase
        .from('subscription_plan')
        .select(SUBSCRIPTION_PLAN_SELECT)
        .eq('code', code)
        .eq('is_active', true)
        .single(),
    ),
  listMine: async () =>
    decodeSubscriptions(
      await runQuery(
        supabase
          .from('subscription')
          .select(SUBSCRIPTION_SELECT)
          .eq('user_id', userId)
          .order('starts_at', { ascending: false }),
      ),
    ),
  hasActive: async () => {
    const row = await runQuery(
      supabase
        .from('subscription')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'validated')
        .gte('ends_at', new Date().toISOString())
        .limit(1)
        .maybeSingle(),
    );
    return row !== null;
  },
  create: async (plan, { startsAt, endsAt }) =>
    decodeSubscription(
      await runQuery(
        supabase
          .from('subscription')
          .insert({
            user_id: userId,
            plan_code: plan.code,
            plan_name: plan.label,
            price_cents: plan.price_cents,
            starts_at: startsAt,
            ends_at: endsAt,
            status: 'pending',
          })
          .select(SUBSCRIPTION_SELECT)
          .single(),
      ),
    ),
});
