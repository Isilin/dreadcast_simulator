import styles from './effect-chip.module.css';

import { getTagFromProperty, type Effect } from '@/domain/item';

interface Props {
  effect: Effect;
}

export const EffectChip = ({ effect }: Props) => {
  const signed = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
  const tag = getTagFromProperty(effect.property);
  const colorClass =
    effect.value > 0
      ? styles.positive
      : effect.value < 0
        ? styles.negative
        : styles.neutral;

  return (
    <span className={`${styles.chip} ${colorClass}`}>
      {tag} {signed}
    </span>
  );
};
