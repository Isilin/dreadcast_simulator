import styles from './EffectChip.module.css';

interface Props {
  value: number;
  tag: string;
  name: string;
}

export const EffectChip = ({ value, tag, name }: Props) => {
  const signed = value > 0 ? `+${value}` : `${value}`;
  const valueType = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';

  return (
    <span className={styles.chip} data-value-type={valueType} title={name}>
      {tag} {signed}
    </span>
  );
};
