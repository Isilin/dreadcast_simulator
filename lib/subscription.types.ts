export type SubscriptionPlanCode = string;

export interface SubscriptionPlanResponseDto {
  code: string;
  label: string;
  duration_ingame_years: number | null;
  price_cents: number;
  sort_order: number;
}

export interface SubscriptionResponseDto {
  id: string;
  user_id: string;
  plan_code: SubscriptionPlanCode;
  plan_name: string;
  price_cents: number;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface CreateSubscriptionRequestDto {
  planCode: SubscriptionPlanCode;
}
