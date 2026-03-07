import styles from './DrugSelector.module.css';
import { useDrugActions, useDrugId } from '../../model/drug.store';
import type { Drug } from '../../model/drug.types';

import { StatValues, type Stat } from '@/domain';
import { EffectChip, UiImage } from '@/ui';

interface Props {
  drug: Drug;
}

export const DrugSelector = ({ drug }: Props) => {
  const selectedId = useDrugId();
  const { selectDrug, deselectDrug } = useDrugActions();
  const isActive = selectedId === drug.id;

  const handleClick = () => {
    if (isActive) {
      deselectDrug();
    } else {
      selectDrug(drug.id);
    }
  };

  return (
    <li
      className={styles.card}
      data-active={isActive || undefined}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isActive}
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? handleClick() : undefined
      }
    >
      <span className={styles.name}>{drug.name}</span>
      <UiImage src={drug.image} alt={drug.name} className={styles.image} />
      <div className={styles.effects}>
        {drug.sideEffects.map((effect) => (
          <EffectChip
            key={effect.property}
            value={effect.value}
            tag={StatValues[effect.property as Stat].tag}
            name={StatValues[effect.property as Stat].label}
          />
        ))}
      </div>
    </li>
  );
};
