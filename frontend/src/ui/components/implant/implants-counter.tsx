import { useMemo } from 'react';

import styles from './implants-counter.module.css';

import { useSuit } from '@/ui/hooks/use-suit';

export const ImplantsCounter = () => {
  const MAX_IMPLANTS = 58;

  const { implantsCount } = useSuit();
  const countStyle = useMemo(() => {
    if (implantsCount > MAX_IMPLANTS) return styles.countError;
    else if (implantsCount === MAX_IMPLANTS) return styles.countValid;
    else return styles.countIncomplete;
  }, [implantsCount]);

  return (
    <span className={countStyle}>
      ({implantsCount} / {MAX_IMPLANTS})
    </span>
  );
};
