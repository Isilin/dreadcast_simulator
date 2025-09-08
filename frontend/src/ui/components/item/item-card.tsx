import styles from './item-card.module.css';

import type { Item } from '@/domain/item';
import { useSuit } from '@/ui/hooks/use-suit';

interface Props {
  item: Item;
  onClick?: () => void;
}

export const ItemCard = ({ item, onClick }: Props) => {
  const suit = useSuit();

  return (
    <article className={styles['item-card']} onClick={onClick}>
      <div className={styles['item-head']}>
        <h3 className={styles['item-title']}>{item.name}</h3>
        <img
          src={item.image}
          alt={item.name}
          className={styles['item-thumb']}
        />
      </div>
      <dl className={styles['item-meta']}>
        <div>
          <dt>Durabilité :</dt>
          <dd>{item.integrity}</dd>
        </div>
        <div>
          <dt>Tech :</dt>
          <dd>{item.tech}</dd>
        </div>
        <div>
          <dt>Type :</dt>
          <dd>{item.type}</dd>
        </div>
      </dl>
      <ul className={styles['item-stats']}>
        {item.prerequisites?.map((prerequisite) => (
          <li
            key={`prerequisite-` + prerequisite.skill}
            className={
              suit[prerequisite.skill as keyof typeof useSuit] <
              prerequisite.value
                ? styles['invalid']
                : ''
            }
          >
            <span className={styles.key}>{prerequisite.value}</span>
            <span className={styles.value}>{prerequisite.skill}</span>
          </li>
        ))}
      </ul>
      <ul className={styles['item-stats']}>
        {item.effects?.map((effect) => (
          <li key={`effect-` + effect.property}>
            <span>
              {effect.value > 0 && '+'}
              {effect.value} {effect.property}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};
