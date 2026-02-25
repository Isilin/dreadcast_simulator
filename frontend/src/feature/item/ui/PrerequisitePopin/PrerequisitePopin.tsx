import styles from './PrerequisitePopin.module.css';

import { StatValues } from '@/domain';
import { type Item } from '@/feature/item';
import { usePureStatSelector } from '@/feature/suit';
import { Popin, WarningIcon } from '@/ui';

interface Props {
  item: Item;
}

export const PrerequisitePopin = ({ item }: Props) => {
  const pureStats = usePureStatSelector();
  const { prerequisites = [] } = item;
  return (
    <Popin
      className={styles.warningIcon}
      content={
        <>
          <strong className={styles.prerequisitesTitle}>Prérequis</strong>
          <ul className={styles.prerequisites}>
            {prerequisites.map((prerequisite) => {
              const invalid =
                pureStats[prerequisite.property] < prerequisite.value;

              return (
                <li
                  key={`prerequisite-` + prerequisite.property}
                  data-invalid={invalid}
                >
                  <span className={styles.key}>{prerequisite.value}</span>
                  <span className={styles.value}>
                    {StatValues[prerequisite.property].tag}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      }
    >
      <WarningIcon />
    </Popin>
  );
};
