import { Context, Effect, Layer, Schema } from 'effect';

import type { SubscriptionDateRange } from './subscription.rules.js';
import type { SubscriptionPlan } from './subscription.schema.js';
import { Subscription } from './subscription.schema.js';
import { CurrentUser } from '../../platform/auth.js';
import type { DbError } from '../../platform/db-error.js';
import { decodeRows, runQuery } from '../../platform/supabase.js';

// The status is plain text in the database: validate the rows against the
// contract.
const decodeSubscriptions = decodeRows(Schema.Array(Subscription));
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

export class SubscriptionRepo extends Context.Service<
  SubscriptionRepo,
  {
    readonly activePlans: Effect.Effect<
      ReadonlyArray<SubscriptionPlan>,
      DbError,
      CurrentUser
    >;
    /** Fails with PGRST116 when no active plan has this code. */
    readonly activePlan: (
      code: string,
    ) => Effect.Effect<SubscriptionPlan, DbError, CurrentUser>;
    /** Most recent first. */
    readonly listMine: Effect.Effect<
      ReadonlyArray<Subscription>,
      DbError,
      CurrentUser
    >;
    /**
     * Same rule as private.has_active_subscription(): validated and not
     * expired.
     */
    readonly hasActive: Effect.Effect<boolean, DbError, CurrentUser>;
    /** Creates a pending subscription, validated later by an admin. */
    readonly create: (
      plan: SubscriptionPlan,
      range: SubscriptionDateRange,
    ) => Effect.Effect<Subscription, DbError, CurrentUser>;
  }
>()('server/SubscriptionRepo') {
  static readonly layer = Layer.succeed(SubscriptionRepo, {
    activePlans: CurrentUser.use(({ supabase }) =>
      runQuery(
        supabase
          .from('subscription_plan')
          .select(SUBSCRIPTION_PLAN_SELECT)
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ),
    ),
    activePlan: (code) =>
      CurrentUser.use(({ supabase }) =>
        runQuery(
          supabase
            .from('subscription_plan')
            .select(SUBSCRIPTION_PLAN_SELECT)
            .eq('code', code)
            .eq('is_active', true)
            .single(),
        ),
      ),
    listMine: CurrentUser.use(({ supabase, userId }) =>
      runQuery(
        supabase
          .from('subscription')
          .select(SUBSCRIPTION_SELECT)
          .eq('user_id', userId)
          .order('starts_at', { ascending: false }),
      ).pipe(Effect.flatMap(decodeSubscriptions)),
    ),
    hasActive: Effect.suspend(() =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('subscription')
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'validated')
            .gte('ends_at', new Date().toISOString())
            .limit(1)
            .maybeSingle(),
        ).pipe(Effect.map((row) => row !== null)),
      ),
    ),
    create: (plan, { startsAt, endsAt }) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
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
        ).pipe(Effect.flatMap(decodeSubscription)),
      ),
  });
}
