import styles from './kit-card.module.css';

import type { Kit } from '@/domain/kit';

interface Props {
  kit: Kit;
  onClick?: () => void;
}

export const KitCard = ({ kit, onClick }: Props) => {
  return (
    <div className={styles.Card} onClick={onClick}>
      <h2 className={styles.Title}>{kit.name}</h2>
      <h5 className={styles.Tech}>Tech : {kit.tech}</h5>
      <h5>Type : {kit.type}</h5>
      <span>
        {kit.effects
          ?.map(
            (effect) =>
              `${effect.property}: ${effect.value > 0 && '+'}${effect.value}`,
          )
          .join(', ')}
      </span>
    </div>
  );
};
