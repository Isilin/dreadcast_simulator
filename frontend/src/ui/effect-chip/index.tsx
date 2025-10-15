import styles from './effect-chip.module.css';

interface Props {
  value: number;
  tag: string;
}

export const EffectChip = ({ value, tag }: Props) => {
  const signed = value > 0 ? `+${value}` : `${value}`;
  const colorClass = value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;

  return (
    <span className={`${styles.chip} ${colorClass}`}>
      {tag} {signed}
    </span>
  );
};
