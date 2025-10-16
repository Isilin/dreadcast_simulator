import { itemPrerequisitesMet } from '../../model/item.rules';
import styles from './ItemCard.module.css';

import { StatValues } from '@/domain';
import { useImplantsEffects } from '@/feature/implant';
import { type Item } from '@/feature/item';
import { useRaceStats } from '@/feature/profile';
import { EffectChip } from '@/ui/effect-chip';
import { WarningIcon } from '@/ui/icons';
import { Popin } from '@/ui/popin';
import { UiImage } from '@/ui/UiImage/UiImage';

interface Props {
  item: Item;
  onClick?: () => void;
}

// TODO mettre un spinner aussi pour le temps de chargement de l'aperçu de l'item

export const ItemCard = ({ item, onClick }: Props) => {
  const raceStats = useRaceStats();
  const implantsEffects = useImplantsEffects();
  const prerequisitesOk = itemPrerequisitesMet(
    item,
    raceStats || {},
    implantsEffects,
  );

  return (
    <article className={styles['item-card']} onClick={onClick}>
      <div className={styles['item-head']}>
        <Popin content={item.name}>
          <h3 className={styles['item-title']}>
            {!prerequisitesOk && (
              <WarningIcon
                className={styles.warningIcon}
                title="Pré-requis non remplis"
              />
            )}
            {item.name}
          </h3>
        </Popin>
        <UiImage
          src={item.image}
          alt={item.name}
          wrapperClassName={styles['item-thumb']}
          radius={8}
          fit="contain"
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
        {item.prerequisites?.map((prerequisite) => {
          const totalPrereq =
            Number(
              raceStats?.[prerequisite.property as keyof typeof raceStats],
            ) ||
            0 +
              (Number(
                implantsEffects?.[
                  prerequisite.property as keyof typeof implantsEffects
                ],
              ) || 0);

          return (
            <li
              key={`prerequisite-` + prerequisite.property}
              className={
                totalPrereq < prerequisite.value ? styles['invalid'] : ''
              }
            >
              <span className={styles.key}>{prerequisite.value}</span>
              <span className={styles.value}>
                {StatValues[prerequisite.property].tag}
              </span>
            </li>
          );
        })}
      </ul>
      <ul className={styles['item-stats']}>
        {item.effects?.map((effect) => (
          <li key={`effect-` + effect.property}>
            <EffectChip
              value={effect.value}
              tag={StatValues[effect.property].tag}
            />
          </li>
        ))}
      </ul>
    </article>
  );
};
