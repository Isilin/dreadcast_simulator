export const SUBSCRIPTION_SELECT_QUERY = `
  id,
  user_id,
  plan_code,
  plan_name,
  price_cents,
  starts_at,
  ends_at,
  created_at
`;

export const SUBSCRIPTION_PLAN_SELECT_QUERY = `
  code,
  label,
  duration_ingame_years,
  price_cents,
  sort_order
`;

export const INFINITE_SUBSCRIPTION_END_ISO = '9999-12-31T23:59:59.999Z';

export interface SubscriptionDateRange {
  startsAt: string;
  endsAt: string;
}

export const buildSubscriptionDateRange = (
  durationIngameYears: number | null,
  now = new Date(),
): SubscriptionDateRange => {
  const startsAt = now.toISOString();

  if (durationIngameYears === null) {
    return {
      startsAt,
      endsAt: INFINITE_SUBSCRIPTION_END_ISO,
    };
  }

  const endsAtDate = new Date(now);
  endsAtDate.setUTCMonth(endsAtDate.getUTCMonth() + durationIngameYears);

  return {
    startsAt,
    endsAt: endsAtDate.toISOString(),
  };
};
