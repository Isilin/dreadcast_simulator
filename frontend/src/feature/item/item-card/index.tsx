import styles from './item-card.module.css';

import { type Item, getTagFromSkill } from '@/domain';
import { EffectChip } from '@/feature/effect-chip';
import { useSuit } from '@/ui/hooks/use-suit';
import { Popin } from '@/ui/popin';

interface Props {
  item: Item;
  onClick?: () => void;
}

// TODO mettre un spinner aussi pour le temps de chargement de l'aperçu de l'item

export const ItemCard = ({ item, onClick }: Props) => {
  const suit = useSuit();

  return (
    <article className={styles['item-card']} onClick={onClick}>
      <div className={styles['item-head']}>
        <Popin content={item.name}>
          <h3 className={styles['item-title']}>{item.name}</h3>
        </Popin>
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
            <span className={styles.value}>
              {getTagFromSkill(prerequisite.skill)}
            </span>
          </li>
        ))}
      </ul>
      <ul className={styles['item-stats']}>
        {item.effects?.map((effect) => (
          <li key={`effect-` + effect.property}>
            <EffectChip effect={effect} />
          </li>
        ))}
      </ul>
    </article>
  );
};
