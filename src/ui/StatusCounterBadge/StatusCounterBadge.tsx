import { useMemo } from 'react';

import styles from './StatusCounterBadge.module.css';

interface Props {
  maxValue?: number;
  value?: number;
}

export const StatusCounterBadge = ({ value = 0, maxValue = 0 }: Props) => {
  const state = useMemo(() => {
    if (value > maxValue) return 'error';
    if (value === maxValue) return 'info';
    return 'warning';
  }, [value, maxValue]);

  return (
    <span className={styles.badge} data-status={state}>
      ({value} / {maxValue})
    </span>
  );
};
