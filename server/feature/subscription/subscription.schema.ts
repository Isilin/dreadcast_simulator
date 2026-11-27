import { z } from '@hono/zod-openapi';

const PriceCents = z.number().int().min(1);

export const SubscriptionPlan = z
  .object({
    code: z.string().min(1),
    label: z.string().min(1),
    duration_ingame_years: z.number().int().min(1).nullable(),
    price_cents: PriceCents,
    sort_order: z.number().int().min(0),
  })
  .openapi('SubscriptionPlan');

export const Subscription = z
  .object({
    id: z.string(),
    user_id: z.string(),
    plan_code: z.string(),
    plan_name: z.string(),
    price_cents: PriceCents,
    starts_at: z.string(),
    ends_at: z.string(),
    /** 'pending' until an admin validates it. */
    status: z.enum(['pending', 'validated']),
    validated_at: z.string().nullable(),
    validated_by: z.string().nullable(),
    created_at: z.string().nullable(),
  })
  .openapi('Subscription');

export const CreateSubscriptionPayload = z.object({
  planCode: z.string().min(1),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlan>;
export type Subscription = z.infer<typeof Subscription>;
