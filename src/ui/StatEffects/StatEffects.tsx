import styles from './StatEffects.module.css';

import { StatValues, type StatModifier } from '@/domain';

interface StatEffectsProps {
  effects: StatModifier[];
  /** Phrasing markup (spans), for a list inside a button. */
  inline?: boolean;
}

/** Compact buff / debuff list, e.g. "FOR +3 · AGI -1". */
export const StatEffects = ({ effects, inline = false }: StatEffectsProps) => {
  if (effects.length === 0) return null;

  const List = inline ? 'span' : 'ul';
  const Entry = inline ? 'span' : 'li';

  return (
    <List className={styles.effects} aria-label={inline ? undefined : 'Effets'}>
      {effects.map(({ property, value }) => (
        <Entry
          key={property}
          className={styles.effect}
          data-sign={
            value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'
          }
          title={StatValues[property].label}
        >
          {StatValues[property].tag} {value > 0 ? `+${value}` : value}
        </Entry>
      ))}
    </List>
  );
};
