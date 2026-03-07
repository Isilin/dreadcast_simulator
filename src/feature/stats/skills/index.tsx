import { useMemo } from 'react';

import styles from './skills.module.css';

import { StatValues } from '@/domain';
import { useSuitSelector } from '@/feature/suit';

export const Skills = () => {
  const suit = useSuitSelector();

  const skills = useMemo(
    () =>
      Object.entries(StatValues).map(([s, sData]) => {
        return {
          label: sData.label,
          value: suit[s as keyof typeof useSuitSelector],
        };
      }),
    [suit],
  );

  return (
    <ul className={styles.container}>
      {skills.map((s) => (
        <li key={s.label} className={styles.skill}>
          <span className={styles.label}>{s.label}:</span>
          <span className={styles.value}>{s.value}</span>
        </li>
      ))}
    </ul>
  );
};
