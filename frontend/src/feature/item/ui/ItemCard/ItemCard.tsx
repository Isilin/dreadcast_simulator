import styles from './ItemCard.module.css';

import { StatValues } from '@/domain';
import { useImplantsEffects } from '@/feature/implant';
import { itemPrerequisitesMet, type Item } from '@/feature/item';
import { useRaceStats } from '@/feature/profile';
import { usePureStatSelector } from '@/feature/suit';
import { Card } from '@/ui/Card';
import { EffectChip } from '@/ui/effect-chip';
import { WarningIcon } from '@/ui/icons';
import { Popin } from '@/ui/popin';
import { UiImage } from '@/ui/UiImage/UiImage';

interface Props {
  item: Item;
  variant?: 'list' | 'slot';
  onClick?: () => void;
}

export const ItemCard = ({ item, variant = 'list', onClick }: Props) => {
  const raceStats = useRaceStats();
  const pureStats = usePureStatSelector();
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
      className={[
        styles.itemCard,
        styles[variant],
        prerequisitesOk ? '' : styles.invalid,
      ].join(' ')}
      onClick={onClick}
      role="button"
      aria-label={name}
    >
      {!prerequisitesOk && prerequisites.length > 0 && (
        <Popin
          className={styles.warningIcon}
          content={
            <>
              <strong className={styles.prerequisitesTitle}>Prérequis</strong>
              <ul className={styles.prerequisites}>
                {prerequisites.map((prerequisite) => {
                  const invalid =
                    pureStats[prerequisite.property] < prerequisite.value;

                  return (
                    <li
                      key={`prerequisite-` + prerequisite.property}
                      className={invalid ? styles.invalid : ''}
                    >
                      <span className={styles.key}>{prerequisite.value}</span>
                      <span className={styles.value}>
                        {StatValues[prerequisite.property].tag}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          }
        >
          <WarningIcon />
        </Popin>
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
      <header className={styles.head}>
        <h3 className={styles.title} title={name}>
          {name}
        </h3>
      </header>
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
