import { MAX_IMPLANTS } from '../../model/implant.rules';
import {
  useImplantsCount,
  useImplantsStatus,
} from '../../model/implant.selectors';
import styles from './ImplantsCounter.module.css';

export const ImplantsCounter = () => {
  const implantsCount = useImplantsCount();
  const status = useImplantsStatus();

  return (
    <span className={styles[status]}>
      ({implantsCount} / {MAX_IMPLANTS})
    </span>
  );
};
