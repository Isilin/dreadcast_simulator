import { useMemo } from 'react';

import styles from './UnmetPrerequisitesNotice.module.css';
import { collectUnmetPrerequisites } from '../../model/unmet-prerequisites.rules';
import { workbenchSlotLabels } from '../../model/workbench.types';

import { useItemsState } from '@/feature/item';
import { useKitsState } from '@/feature/kit';
import {
  formatPrerequisite,
  usePrerequisiteContext,
} from '@/feature/prerequisite';
import { useTitleNames } from '@/feature/title';
import { WarningIcon } from '@/ui/Icon';

/** Red summary of the equipment and kits used without their prerequisites. */
export const UnmetPrerequisitesNotice = () => {
  const items = useItemsState();
  const kits = useKitsState();
  const context = usePrerequisiteContext();
  const titleNames = useTitleNames();
  const entries = useMemo(
    () => collectUnmetPrerequisites(items, kits, context),
    [context, items, kits],
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className={styles.notice} aria-label="Prérequis manquants">
      <p className={styles.title}>
        <WarningIcon className={styles.icon} />
        Prérequis manquants
      </p>
      <ul className={styles.list}>
        {entries.map(({ spot, kind, name, unmet }) => (
          <li key={`${spot}-${kind}-${name}`}>
            <strong>
              {kind === 'kit' ? `Kit ${name}` : name}
              <span className={styles.spot}> · {workbenchSlotLabels[spot]}</span>
            </strong>
            <span className={styles.missing}>
              {unmet
                .map((prerequisite) =>
                  formatPrerequisite(prerequisite, context, titleNames),
                )
                .join(', ')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
