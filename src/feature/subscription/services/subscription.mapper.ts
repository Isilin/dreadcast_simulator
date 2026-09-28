import type {
  Subscription as SubscriptionDto,
  SubscriptionPlan as SubscriptionPlanDto,
} from '@server/feature/subscription/subscription.schema';

import type { SubscriptionPlan, SubscriptionRecord } from '../model';

export const toDomain = (dto: SubscriptionDto): SubscriptionRecord => ({
  id: dto.id,
  userId: dto.user_id,
  planCode: dto.plan_code,
  planName: dto.plan_name,
  priceCents: dto.price_cents,
  startsAt: dto.starts_at,
  endsAt: dto.ends_at,
  status: dto.status,
  validatedAt: dto.validated_at,
  validatedBy: dto.validated_by,
  // Nullable column, always set by its default: fall back on the start.
  createdAt: dto.created_at ?? dto.starts_at,
});

export const toPlanDomain = (dto: SubscriptionPlanDto): SubscriptionPlan => ({
  code: dto.code,
  label: dto.label,
  durationIngameYears: dto.duration_ingame_years,
  priceCents: dto.price_cents,
  sortOrder: dto.sort_order,
});
