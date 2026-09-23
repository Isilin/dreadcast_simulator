import styles from './KitEffects.module.css';

import { StatValues, type StatModifier } from '@/domain';

interface KitEffectsProps {
  effects: StatModifier[];
}

/** Compact buff / debuff list of a kit, e.g. "FOR +3 · AGI -1". */
export const KitEffects = ({ effects }: KitEffectsProps) =>
  effects.length > 0 ? (
    <ul className={styles.effects} aria-label="Effets">
      {effects.map(({ property, value }) => (
        <li
          key={property}
          className={styles.effect}
          data-sign={
            value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'
          }
          title={StatValues[property].label}
        >
          {StatValues[property].tag} {value > 0 ? `+${value}` : value}
        </li>
      ))}
    </ul>
  ) : null;
