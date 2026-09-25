import type { ReactNode } from 'react';

import styles from './ImplantEffectsPopin.module.css';
import { computeImplantLevelValue } from '../../model/implant.rules';
import type { Implant } from '../../model/implant.types';

import { StatValues } from '@/domain';
import { Popin } from '@/ui/Popin';

const valueFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 3,
});

const formatBonus = (value: number): string =>
  value > 0 ? `+${valueFormatter.format(value)}` : valueFormatter.format(value);

interface ImplantEffectsPopinProps {
  implant: Implant;
  level: number;
  /** Trigger: the implant row content. */
  children: ReactNode;
  className?: string;
}

/**
 * What an implant does, on hover or focus: the boosted stats, the current
 * bonus and the bonus of every level.
 */
export const ImplantEffectsPopin = ({
  implant,
  level,
  children,
  className,
}: ImplantEffectsPopinProps) => {
  const hasStatEffects =
    implant.attributes.length > 0 &&
    implant.valuePerLevel.some((value) => value !== 0);
  const currentValue = computeImplantLevelValue(implant, level);
  const levels = Array.from({ length: implant.levelMax }, (_, i) => i + 1);

  return (
    <Popin
      className={className}
      popupClassName={styles.popup}
      placement="left"
      focusable
      content={
        <>
          <strong className={styles.title}>{implant.name}</strong>
          {hasStatEffects ? (
            <>
              <p className={styles.attributes}>
                {implant.attributes
                  .map((stat) => StatValues[stat].label)
                  .join(', ')}
              </p>
              <p className={styles.current}>
                {level > 0
                  ? `Niveau ${level} : ${formatBonus(currentValue)}`
                  : 'Non installé'}
                {implant.attributes.length > 1 && level > 0
                  ? ' sur chaque stat'
                  : ''}
              </p>
              <table className={styles.levels}>
                <caption className="visuallyHidden">
                  Bonus par niveau (non cumulé)
                </caption>
                <tbody>
                  <tr>
                    <th scope="row">Niv.</th>
                    {levels.map((value) => (
                      <td key={value} data-current={value === level}>
                        {value}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Bonus</th>
                    {levels.map((value) => (
                      <td key={value} data-current={value === level}>
                        {formatBonus(computeImplantLevelValue(implant, value))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <p className={styles.attributes}>
              Effet hors statistiques : non simulé.
            </p>
          )}
        </>
      }
    >
      {children}
    </Popin>
  );
};
