import z from 'zod';

export const subscriptionPlanCodeSchema = z.enum([
  'annual_1',
  'annual_6',
  'annual_12',
  'lifetime',
]);

export const subscriptionPlanResponseDtoSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  duration_ingame_years: z.number().int().positive().nullable(),
  price_cents: z.coerce.number().int().min(1),
  sort_order: z.coerce.number().int().min(0),
});

export const subscriptionPlanArrayResponseDtoSchema = z.array(
  subscriptionPlanResponseDtoSchema,
);

export const subscriptionResponseDtoSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  plan_code: subscriptionPlanCodeSchema,
  plan_name: z.string(),
  price_cents: z.coerce.number().int().min(1),
  starts_at: z.string().min(1),
  ends_at: z.string().min(1),
  status: z.enum(['pending', 'validated']),
  validated_at: z.string().min(1).nullable(),
  validated_by: z.string().min(1).nullable(),
  created_at: z.string().min(1),
});

export const subscriptionArrayResponseDtoSchema = z.array(
  subscriptionResponseDtoSchema,
);

export type SubscriptionResponseDto = z.infer<
  typeof subscriptionResponseDtoSchema
>;
export type SubscriptionPlanResponseDto = z.infer<
  typeof subscriptionPlanResponseDtoSchema
>;
