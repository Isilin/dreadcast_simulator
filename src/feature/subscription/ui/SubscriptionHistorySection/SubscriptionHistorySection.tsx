import { useMemo } from 'react';

import type { SubscriptionRecord } from '../../model';
import styles from '../SubscriptionPage/SubscriptionPage.module.css';
import {
  formatDate,
  formatPrice,
  getActiveSubscription,
} from '../SubscriptionPageUtils';

interface SubscriptionHistorySectionProps {
  subscriptions: SubscriptionRecord[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return error instanceof Error ? error.message : fallbackMessage;
};

export const SubscriptionHistorySection = ({
  subscriptions,
  isLoading,
  isError,
  error,
}: SubscriptionHistorySectionProps) => {
  const activeSubscription = useMemo(() => {
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

  return (
    <section className={styles.history} aria-label="Historique des abonnements">
      <h2 className={styles.historyTitle}>Etat actuel</h2>

      {isLoading ? (
        <p className={styles.info}>Chargement des abonnements...</p>
      ) : null}

      {isError ? (
        <p className={styles.error}>
          {getErrorMessage(error, 'Erreur de chargement des abonnements.')}
        </p>
      ) : null}

      {!isLoading && !isError ? (
        <>
          {activeSubscription ? (
            <div className={styles.activeBox}>
              <strong>{activeSubscription.planName}</strong>
              <span>
                Du {formatDate(activeSubscription.startsAt)} au{' '}
                {formatDate(activeSubscription.endsAt)}
              </span>
            </div>
          ) : (
            <p className={styles.info}>
              Aucun abonnement actif pour le moment.
            </p>
          )}

          {subscriptions.length > 0 ? (
            <ul className={styles.list}>
              {subscriptions.map((subscription) => (
                <li key={subscription.id} className={styles.listItem}>
                  <span>{subscription.planName}</span>
                  <span>{formatPrice(subscription.priceCents)}</span>
                  <span className={styles.statusRow}>
                    Statut:{' '}
                    <strong>
                      {subscription.status === 'pending'
                        ? 'En attente de validation admin'
                        : 'Valide'}
                    </strong>
                  </span>
                  <span>
                    {formatDate(subscription.startsAt)} -{' '}
                    {formatDate(subscription.endsAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </section>
  );
};
