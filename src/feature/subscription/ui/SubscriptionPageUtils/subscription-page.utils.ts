import type { SubscriptionRecord } from '../../model';

const centsFormatter = new Intl.NumberFormat('fr-FR');

export const formatPrice = (priceCents: number) =>
  `${centsFormatter.format(priceCents)}¢`;

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));

export const getActiveSubscription = (
  subscriptions: SubscriptionRecord[],
  nowTimestamp = Date.now(),
) => {
  return subscriptions.find((subscription) => {
    const endTimestamp = new Date(subscription.endsAt).getTime();
    return Number.isFinite(endTimestamp) && endTimestamp >= nowTimestamp;
  });
};
