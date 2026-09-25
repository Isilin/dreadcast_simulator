import styles from './ItemCard.module.css';
import type { Item } from '../../model/item.types';

import { StatValues } from '@/domain';
import {
  PrerequisiteWarning,
  useUnmetPrerequisites,
} from '@/feature/prerequisite';
import { Card, EffectChip, UiImage } from '@/ui';

interface Props {
  item: Item;
  variant?: 'list' | 'slot';
  onClick?: () => void;
  selected?: boolean;
}

export const ItemCard = ({
  item,
  variant = 'list',
  onClick,
  selected,
}: Props) => {
  const prerequisitesOk =
    useUnmetPrerequisites(item.prerequisites).length === 0;
  const { name, image, integrity, tech, effects = [], prerequisites } = item;

  return (
    <Card
      variant={variant}
      state={prerequisitesOk ? (selected ? 'info' : 'default') : 'error'}
      onClick={onClick}
      label={name}
    >
      <PrerequisiteWarning
        prerequisites={prerequisites}
        className={styles.prerequisiteWarning}
      />
      <div className={styles.meta}>
        <span className={styles.badge} title="Durabilité">
          <span className={styles.key}>Durabilité :</span> {integrity}
        </span>
        <span className={styles.badge} title="Tech">
          <span className={styles.key}>Tech :</span> {tech}
        </span>
      </div>
      <div className={styles.thumbWrapper}>
        <UiImage
          src={image}
          alt={name}
          wrapperClassName={styles.thumb}
          radius={8}
          fit="contain"
        />
      </div>
      <h3 className={styles.title} title={name}>
        {name}
      </h3>
      {effects.length > 0 && (
        <ul className={styles.effects}>
          {effects.map((effect) => (
            <li key={`effect-` + effect.property}>
              <EffectChip
                value={effect.value}
                tag={StatValues[effect.property].tag}
                name={StatValues[effect.property].label}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
