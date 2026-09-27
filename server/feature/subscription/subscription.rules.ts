const INFINITE_SUBSCRIPTION_END_ISO = '9999-12-31T23:59:59.999Z';

export interface SubscriptionDateRange {
  startsAt: string;
  endsAt: string;
}

/**
 * One in-game year lasts one real month. A plan without duration never ends.
 */
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
