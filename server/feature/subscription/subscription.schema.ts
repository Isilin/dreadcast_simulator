import { Schema } from 'effect';

export const SubscriptionPlan = Schema.Struct({
  code: Schema.String,
  label: Schema.String,
  duration_ingame_years: Schema.NullOr(Schema.Number),
  price_cents: Schema.Number,
  sort_order: Schema.Number,
});

export const Subscription = Schema.Struct({
  id: Schema.String,
  user_id: Schema.String,
  plan_code: Schema.String,
  plan_name: Schema.String,
  price_cents: Schema.Number,
  starts_at: Schema.String,
  ends_at: Schema.String,
  /** 'pending' until an admin validates it. */
  status: Schema.String,
  validated_at: Schema.NullOr(Schema.String),
  validated_by: Schema.NullOr(Schema.String),
  created_at: Schema.NullOr(Schema.String),
});

export const CreateSubscriptionPayload = Schema.Struct({
  planCode: Schema.String.check(Schema.isMinLength(1)),
});

export type SubscriptionPlan = typeof SubscriptionPlan.Type;
export type Subscription = typeof Subscription.Type;
