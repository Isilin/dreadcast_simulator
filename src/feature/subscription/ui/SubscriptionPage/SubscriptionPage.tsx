import {
  SubscriptionHero,
  SubscriptionHistorySection,
  SubscriptionPlansSection,
} from '..';
import styles from './SubscriptionPage.module.css';
import {
  useCreateSubscription,
  useSubscriptionPlans,
  useSubscriptions,
} from '../../services';

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

  const handleChoosePlan = (planCode: string) => {
    createMutation.mutate(planCode);
  };

  return (
    <main className={styles.page}>
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
    </main>
  );
};
