import type { SubscriptionRecord } from './subscription.types';

type SubscriptionState = Pick<SubscriptionRecord, 'status' | 'endsAt'>;

/**
 * Same rule as the API and private.has_active_subscription(): validated and
 * not expired.
 */
export const isSubscriptionActive = (
  subscription: SubscriptionState,
  now = Date.now(),
): boolean => {
  if (subscription.status !== 'validated') return false;
  const endTimestamp = new Date(subscription.endsAt).getTime();
  return Number.isFinite(endTimestamp) && endTimestamp >= now;
};

export const getActiveSubscription = <T extends SubscriptionState>(
  subscriptions: ReadonlyArray<T>,
  now = Date.now(),
): T | undefined =>
  subscriptions.find((subscription) => isSubscriptionActive(subscription, now));
