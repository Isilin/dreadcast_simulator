import { useMemo } from 'react';

import styles from './skills.module.css';

import { getNameFromStat, StatValues, type Skill } from '@/domain';
import { useSuit } from '@/ui/hooks/use-suit';

export const Skills = () => {
  const suit = useSuit();

  const skills = useMemo(
    () =>
      Object.values(StatValues).map((s: string) => {
        return {
          label: getNameFromStat(s as Skill),
          value: suit[s as keyof typeof useSuit],
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
