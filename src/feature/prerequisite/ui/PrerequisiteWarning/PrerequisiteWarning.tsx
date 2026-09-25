import { useMemo } from 'react';

import styles from './PrerequisiteWarning.module.css';
import {
  findUnmetPrerequisites,
  formatPrerequisite,
  prerequisiteKey,
} from '../../model/prerequisite.rules';
import { usePrerequisiteContext } from '../../model/prerequisite.selectors';
import type { Prerequisite } from '../../model/prerequisite.types';

import { useTitleNames } from '@/feature/title';
import { WarningIcon } from '@/ui/Icon';
import { Popin } from '@/ui/Popin';

interface PrerequisiteWarningProps {
  prerequisites: Prerequisite[] | undefined;
  /** Shows "n prérequis manquant(s)" next to the icon. */
  showCount?: boolean;
  className?: string;
}

export const formatUnmetCount = (count: number): string =>
  `${count} prérequis manquant${count > 1 ? 's' : ''}`;

/**
 * Red warning when some prerequisites are not met, with the missing ones in a
 * red popin. Renders nothing when every prerequisite is met.
 */
export const PrerequisiteWarning = ({
  prerequisites,
  showCount = false,
  className,
}: PrerequisiteWarningProps) => {
  const context = usePrerequisiteContext();
  const titleNames = useTitleNames();
  const unmet = useMemo(
    () => findUnmetPrerequisites(prerequisites, context),
    [context, prerequisites],
  );

  if (unmet.length === 0) {
    return null;
  }

  const label = formatUnmetCount(unmet.length);

  return (
    <Popin
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      popupClassName={styles.popup}
      content={
        <>
          <strong className={styles.title}>Prérequis manquants</strong>
          <ul className={styles.list}>
            {unmet.map((prerequisite) => (
              <li key={prerequisiteKey(prerequisite)}>
                {formatPrerequisite(prerequisite, context, titleNames)}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <WarningIcon className={styles.icon} />
      <span className={showCount ? styles.count : 'visuallyHidden'}>
        {label}
      </span>
    </Popin>
  );
};
