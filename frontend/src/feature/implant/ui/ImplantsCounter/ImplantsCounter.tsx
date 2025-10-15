import styles from './ImplantsCounter.module.css';

import {
  MAX_IMPLANTS,
  useImplantsCount,
  useImplantsStatus,
} from '@/feature/implant';

export const ImplantsCounter = () => {
  const implantsCount = useImplantsCount();
  const status = useImplantsStatus();

  return (
    <span className={styles[status]}>
      ({implantsCount} / {MAX_IMPLANTS})
    </span>
  );
};
