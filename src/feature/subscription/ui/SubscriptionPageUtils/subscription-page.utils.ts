export { getActiveSubscription } from '../../model';

const centsFormatter = new Intl.NumberFormat('fr-FR');

export const formatPrice = (priceCents: number) =>
  `${centsFormatter.format(priceCents)}¢`;

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
