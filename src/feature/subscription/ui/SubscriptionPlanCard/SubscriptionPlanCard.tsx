import type { SubscriptionPlan } from '../../model';
import styles from '../SubscriptionPage/SubscriptionPage.module.css';
import { formatPrice } from '../SubscriptionPageUtils';

import { Card } from '@/ui';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isPending: boolean;
  onChoosePlan: (planCode: string) => void;
}

const getPlanLabel = (durationIngameYears: number | null) => {
  if (durationIngameYears === null) {
    return 'Acces illimite';
  }

  return `Valable ${durationIngameYears} an${durationIngameYears > 1 ? 's' : ''} ingame`;
};

export const SubscriptionPlanCard = ({
  plan,
  isPending,
  onChoosePlan,
}: SubscriptionPlanCardProps) => {
  return (
    <Card className={styles.card}>
      <h2 className={styles.cardTitle}>{plan.label}</h2>
      <p className={styles.cardPrice}>{formatPrice(plan.priceCents)}</p>
      <p className={styles.cardMeta}>
        {getPlanLabel(plan.durationIngameYears)}
      </p>
      <button
        type="button"
        className={styles.cta}
        onClick={() => onChoosePlan(plan.code)}
        disabled={isPending}
      >
        {isPending ? 'Activation...' : 'Choisir ce plan'}
      </button>
    </Card>
  );
};
