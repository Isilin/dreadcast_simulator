import { itemPrerequisitesMet } from '../../model/item.rules';
import type { Item } from '../../model/item.types';
import { PrerequisitePopin } from '../PrerequisitePopin';
import styles from './ItemCard.module.css';

import { StatValues } from '@/domain';
import { useImplantsEffects } from '@/feature/implant';
import { useRaceStats } from '@/feature/profile';
import { Card, EffectChip, UiImage } from '@/ui';

interface Props {
  item: Item;
  variant?: 'list' | 'slot';
  onClick?: () => void;
}

export const ItemCard = ({ item, variant = 'list', onClick }: Props) => {
  const raceStats = useRaceStats();
  const implantsEffects = useImplantsEffects();
  const prerequisitesOk = itemPrerequisitesMet(
    item,
    raceStats || {},
    implantsEffects,
  );
  const {
    name,
    image,
    integrity,
    tech,
    effects = [],
    prerequisites = [],
  } = item;

  return (
    <Card
      className={`${styles.itemCard} ${styles[variant]}`}
      data-invalid={!prerequisitesOk}
      onClick={onClick}
      role="button"
      aria-label={name}
    >
      {!prerequisitesOk && prerequisites.length > 0 && (
        <PrerequisitePopin item={item} />
      )}
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
