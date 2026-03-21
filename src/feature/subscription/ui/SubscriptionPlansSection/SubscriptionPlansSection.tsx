import type { SubscriptionPlan } from '../../model';
import styles from '../SubscriptionPage/SubscriptionPage.module.css';
import { SubscriptionPlanCard } from '../SubscriptionPlanCard';

interface SubscriptionPlansSectionProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  isError: boolean;
  queryError: unknown;
  createError: unknown;
  isMutating: boolean;
  onChoosePlan: (planCode: string) => void;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return error instanceof Error ? error.message : fallbackMessage;
};

export const SubscriptionPlansSection = ({
  plans,
  isLoading,
  isError,
  queryError,
  createError,
  isMutating,
  onChoosePlan,
}: SubscriptionPlansSectionProps) => {
  return (
    <>
      <section className={styles.grid} aria-label="Plans d abonnement">
        {isLoading ? (
          <p className={styles.info}>Chargement des plans...</p>
        ) : null}

        {isError ? (
          <p className={styles.error}>
            {getErrorMessage(
              queryError,
              'Erreur de chargement des plans abonnement.',
            )}
          </p>
        ) : null}

        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.code}
            plan={plan}
            isPending={isMutating}
            onChoosePlan={onChoosePlan}
          />
        ))}
      </section>

      {createError ? (
        <p className={styles.error}>
          {getErrorMessage(createError, 'Impossible de creer cet abonnement.')}
        </p>
      ) : null}
    </>
  );
};
