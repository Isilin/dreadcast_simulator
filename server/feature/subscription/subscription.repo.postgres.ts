import { z } from '@hono/zod-openapi';
import { and, asc, desc, eq, gte } from 'drizzle-orm';

import type { SubscriptionRepo } from './subscription.repo.js';
import { Subscription } from './subscription.schema.js';
import { withUser, type Db } from '../../db/client.js';
import { decodeRows, single } from '../../db/rows.js';
import { subscription, subscription_plan } from '../../db/schema.js';
import type { User } from '../../platform/auth.js';

// The status is plain text in the database: validate the rows against the
// contract.
const decodeSubscriptions = decodeRows(z.array(Subscription));
const decodeSubscription = decodeRows(Subscription);

const SUBSCRIPTION_COLUMNS = {
  id: subscription.id,
  user_id: subscription.user_id,
  plan_code: subscription.plan_code,
  plan_name: subscription.plan_name,
  price_cents: subscription.price_cents,
  starts_at: subscription.starts_at,
  ends_at: subscription.ends_at,
  status: subscription.status,
  validated_at: subscription.validated_at,
  validated_by: subscription.validated_by,
  created_at: subscription.created_at,
};

const PLAN_COLUMNS = {
  code: subscription_plan.code,
  label: subscription_plan.label,
  duration_ingame_years: subscription_plan.duration_ingame_years,
  price_cents: subscription_plan.price_cents,
  sort_order: subscription_plan.sort_order,
};

export const makeSubscriptionRepo =
  (db: Db) =>
  (user: User): SubscriptionRepo => {
    const mine = eq(subscription.user_id, user.userId);
    const active = eq(subscription_plan.is_active, true);
    return {
      activePlans: () =>
        withUser(db, user, (tx) =>
          tx
            .select(PLAN_COLUMNS)
            .from(subscription_plan)
            .where(active)
            .orderBy(asc(subscription_plan.sort_order)),
        ),
      activePlan: (code) =>
        withUser(db, user, async (tx) =>
          single(
            await tx
              .select(PLAN_COLUMNS)
              .from(subscription_plan)
              .where(and(eq(subscription_plan.code, code), active)),
          ),
        ),
      listMine: () =>
        withUser(db, user, async (tx) =>
          decodeSubscriptions(
            await tx
              .select(SUBSCRIPTION_COLUMNS)
              .from(subscription)
              .where(mine)
              .orderBy(desc(subscription.starts_at)),
          ),
        ),
      hasActive: () =>
        withUser(db, user, async (tx) => {
          const rows = await tx
            .select({ id: subscription.id })
            .from(subscription)
            .where(
              and(
                mine,
                eq(subscription.status, 'validated'),
                gte(subscription.ends_at, new Date().toISOString()),
              ),
            )
            .limit(1);
          return rows.length > 0;
        }),
      create: (plan, { startsAt, endsAt }) =>
        withUser(db, user, async (tx) =>
          decodeSubscription(
            single(
              await tx
                .insert(subscription)
                .values({
                  user_id: user.userId,
                  plan_code: plan.code,
                  plan_name: plan.label,
                  price_cents: plan.price_cents,
                  starts_at: startsAt,
                  ends_at: endsAt,
                  status: 'pending',
                })
                .returning(SUBSCRIPTION_COLUMNS),
            ),
          ),
        ),
    };
  };
