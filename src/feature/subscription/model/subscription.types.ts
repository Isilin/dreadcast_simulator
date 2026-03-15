export interface SubscriptionPlan {
  code: string;
  label: string;
  durationIngameYears: number | null;
  priceCents: number;
  sortOrder: number;
}

export type SubscriptionPlanCode = string;

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planCode: SubscriptionPlanCode;
  planName: string;
  priceCents: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}
