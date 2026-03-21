import { Dialog } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import {
  SubscriptionHero,
  SubscriptionHistorySection,
  SubscriptionPlansSection,
} from '..';
import styles from './SubscriptionPage.module.css';
import type { SubscriptionRecord } from '../../model';
import {
  useCreateSubscription,
  useSubscriptionPlans,
  useSubscriptions,
} from '../../services';
import { formatPrice } from '../SubscriptionPageUtils';

import { Modal } from '@/ui';
import Routes from '@/utils/routes';

const SUBSCRIPTION_CREDITS_ADDRESS =
  import.meta.env.VITE_SUBSCRIPTION_CREDITS_ADDRESS ??
  'DREADCAST-CREDITS-ADMIN';

export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [pendingSubscription, setPendingSubscription] =
    useState<SubscriptionRecord | null>(null);
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

  const handleChoosePlan = (planCode: string) => {
    createMutation.mutate(planCode, {
      onSuccess: (createdSubscription) => {
        setPendingSubscription(createdSubscription);
      },
    });
  };

  const handleBackToHome = () => {
    navigate({ to: Routes.home });
  };

  const handleClosePendingModal = () => {
    setPendingSubscription(null);
  };

  return (
    <main className={styles.page}>
      <section className={styles.topActions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBackToHome}
        >
          Retour
        </button>
      </section>

      <SubscriptionHero />

      <SubscriptionPlansSection
        plans={subscriptionPlans}
        isLoading={isPlansLoading}
        isError={isPlansError}
        queryError={plansError}
        createError={createMutation.isError ? createMutation.error : null}
        isMutating={createMutation.isPending}
        onChoosePlan={handleChoosePlan}
      />

      <SubscriptionHistorySection
        subscriptions={subscriptions}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <Dialog.Root
        open={pendingSubscription !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePendingModal();
          }
        }}
      >
        <Modal>
          <Modal.Header>
            <Modal.Title>Abonnement en attente de validation</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            {pendingSubscription ? (
              <div className={styles.pendingMessage}>
                <p>
                  Votre plan <strong>{pendingSubscription.planName}</strong> a
                  bien ete enregistre en attente.
                </p>
                <p>
                  Pensez a verser{' '}
                  <strong>{formatPrice(pendingSubscription.priceCents)}</strong>{' '}
                  en credits a l adresse suivante:
                </p>
                <p className={styles.paymentAddress}>
                  {SUBSCRIPTION_CREDITS_ADDRESS}
                </p>
                <p>
                  Un administrateur validera ensuite votre abonnement apres
                  verification du paiement.
                </p>
              </div>
            ) : null}
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </main>
  );
};
