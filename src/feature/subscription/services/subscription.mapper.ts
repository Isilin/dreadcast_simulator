import type { SubscriptionPlan, SubscriptionRecord } from '../model';
import type { SubscriptionResponseDto } from './subscription.schema';
import type { SubscriptionPlanResponseDto } from './subscription.schema';

export const toDomain = (dto: SubscriptionResponseDto): SubscriptionRecord => ({
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
  createdAt: dto.created_at,
});

export const toPlanDomain = (
  dto: SubscriptionPlanResponseDto,
): SubscriptionPlan => ({
  code: dto.code,
  label: dto.label,
  durationIngameYears: dto.duration_ingame_years,
  priceCents: dto.price_cents,
  sortOrder: dto.sort_order,
});
