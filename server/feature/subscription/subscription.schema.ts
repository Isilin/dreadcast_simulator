import { Schema } from 'effect';

const PriceCents = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));

export const SubscriptionPlan = Schema.Struct({
  code: Schema.String.check(Schema.isMinLength(1)),
  label: Schema.String.check(Schema.isMinLength(1)),
  duration_ingame_years: Schema.NullOr(
    Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  ),
  price_cents: PriceCents,
  sort_order: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
});

export const Subscription = Schema.Struct({
  id: Schema.String,
  user_id: Schema.String,
  plan_code: Schema.String,
  plan_name: Schema.String,
  price_cents: PriceCents,
  starts_at: Schema.String,
  ends_at: Schema.String,
  /** 'pending' until an admin validates it. */
  status: Schema.Literals(['pending', 'validated']),
  validated_at: Schema.NullOr(Schema.String),
  validated_by: Schema.NullOr(Schema.String),
  created_at: Schema.NullOr(Schema.String),
});

export const CreateSubscriptionPayload = Schema.Struct({
  planCode: Schema.String.check(Schema.isMinLength(1)),
});

export type SubscriptionPlan = typeof SubscriptionPlan.Type;
export type Subscription = typeof Subscription.Type;
