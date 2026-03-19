import styles from './DrugSelector.module.css';
import { useDrugActions, useDrugId } from '../../model/drug.store';
import type { Drug } from '../../model/drug.types';

import { StatValues, type Stat } from '@/domain';
import { Card, EffectChip, UiImage } from '@/ui';

interface Props {
  drug: Drug;
}

export const DrugSelector = ({ drug }: Props) => {
  const selectedId = useDrugId();
  const { toggleDrug } = useDrugActions();
  const isActive = selectedId === drug.id;

  const handleClick = () => {
    toggleDrug(drug.id);
  };

  return (
    <Card onClick={handleClick} state={isActive ? 'info' : 'default'}>
      <div className={styles.thumbWrapper}>
        <UiImage
          src={drug.image}
          alt={drug.name}
          className={styles.image}
          wrapperClassName={styles.thumb}
          radius={8}
          fit="contain"
        />
      </div>

      <h3 className={styles.title} title={drug.name}>
        {drug.name}
      </h3>

      <ul className={styles.effects}>
        {drug.sideEffects.map((effect) => (
          <li key={`${effect.property}-${effect.value}`}>
            <EffectChip
              value={effect.value}
              tag={StatValues[effect.property as Stat].tag}
              name={StatValues[effect.property as Stat].label}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
};
