import { useMemo } from 'react';

import styles from './StatusCounterBadge.module.css';

interface Props {
  maxValue?: number;
  value?: number;
  variant?: 'counter' | 'invoice';
}

export const StatusCounterBadge = ({
  value = 0,
  maxValue = 0,
  variant = 'counter',
}: Props) => {
  const state = useMemo(() => {
    if (variant === 'invoice') {
      if (value > 40) return 'warning';
      if (value < 0 || value > maxValue) return 'error';
      if (value === 0) return 'info';
      return 'default';
    } else {
      if (value > maxValue) return 'error';
      if (value === maxValue) return 'info';
      return 'warning';
    }
  }, [value, maxValue, variant]);

  return (
    <span className={styles.badge} data-status={state}>
      {variant === 'counter' ? `(${value} / ${maxValue})` : value}
    </span>
  );
};
