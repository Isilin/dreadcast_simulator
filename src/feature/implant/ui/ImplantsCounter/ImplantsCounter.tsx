import styles from './ImplantsCounter.module.css';
import { MAX_IMPLANTS } from '../../model/implant.rules';
import {
  useImplantsCount,
  useImplantsStatus,
} from '../../model/implant.selectors';

export const ImplantsCounter = () => {
  const implantsCount = useImplantsCount();
  const status = useImplantsStatus();

  return (
    <span className={styles[status]}>
      ({implantsCount} / {MAX_IMPLANTS})
    </span>
  );
};
