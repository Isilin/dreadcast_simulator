import { useMemo } from 'react';

import styles from './SubscriptionPage.module.css';
import {
  useCreateSubscription,
  useSubscriptionPlans,
  useSubscriptions,
} from '../../services';

const centsFormatter = new Intl.NumberFormat('fr-FR');

const formatPrice = (priceCents: number) =>
  `${centsFormatter.format(priceCents)}¢`;

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));

export const SubscriptionPage = () => {
  const {
    data: subscriptions = [],
    isLoading,
    isError,
    error,
  } = useSubscriptions();
  const {
    data: subscriptionPlans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
    error: plansError,
  } = useSubscriptionPlans();
  const createMutation = useCreateSubscription();

  const activeSubscription = useMemo(() => {
    const now = Date.now();
    return subscriptions.find((subscription) => {
      const endTimestamp = new Date(subscription.endsAt).getTime();
      return Number.isFinite(endTimestamp) && endTimestamp >= now;
    });
  }, [subscriptions]);

  const handleChoosePlan = (planCode: string) => {
    createMutation.mutate(planCode);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.overline}>Plans SaaS</p>
        <h1 className={styles.title}>Abonnement</h1>
        <p className={styles.subtitle}>
          Choisissez une duree, activez-la instantanement, et gardez un
          historique clair de vos periodes. 1 an ingame correspond a 1 mois IRL.
        </p>
      </section>

      <section className={styles.grid} aria-label="Plans d abonnement">
        {isPlansLoading ? (
          <p className={styles.info}>Chargement des plans...</p>
        ) : null}

        {isPlansError ? (
          <p className={styles.error}>
            {plansError instanceof Error
              ? plansError.message
              : 'Erreur de chargement des plans abonnement.'}
          </p>
        ) : null}

        {subscriptionPlans.map((plan) => (
          <article key={plan.code} className={styles.card}>
            <h2 className={styles.cardTitle}>{plan.label}</h2>
            <p className={styles.cardPrice}>{formatPrice(plan.priceCents)}</p>
            <p className={styles.cardMeta}>
              {plan.durationIngameYears === null
                ? 'Acces illimite'
                : `Valable ${plan.durationIngameYears} an${plan.durationIngameYears > 1 ? 's' : ''} ingame`}
            </p>
            <button
              type="button"
              className={styles.cta}
              onClick={() => handleChoosePlan(plan.code)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Activation...' : 'Choisir ce plan'}
            </button>
          </article>
        ))}
      </section>

      {createMutation.isError ? (
        <p className={styles.error}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Impossible de creer cet abonnement.'}
        </p>
      ) : null}

      <section
        className={styles.history}
        aria-label="Historique des abonnements"
      >
        <h2 className={styles.historyTitle}>Etat actuel</h2>

        {isLoading ? (
          <p className={styles.info}>Chargement des abonnements...</p>
        ) : null}

        {isError ? (
          <p className={styles.error}>
            {error instanceof Error
              ? error.message
              : 'Erreur de chargement des abonnements.'}
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
    </main>
  );
};
