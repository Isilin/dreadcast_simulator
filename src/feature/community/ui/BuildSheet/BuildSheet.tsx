import { useMemo } from 'react';

import styles from './BuildSheet.module.css';
import {
  formatStatValue,
  GENDER_LABELS,
  restoreSnapshot,
  SPOT_LABELS,
  type BuildCatalogs,
} from '../../model';

import { ItemSpotValue, StatValues, type Stat } from '@/domain';
import type { BuildSnapshot } from '@/feature/persistence';
import { UiImage } from '@/ui';

interface BuildSheetProps {
  snapshot: BuildSnapshot;
  catalogs: BuildCatalogs;
  stats: Record<Stat, number>;
}

/**
 * Read-only sheet of a build, driven by props (never by the workbench
 * stores, which keep the user's own build).
 */
export const BuildSheet = ({ snapshot, catalogs, stats }: BuildSheetProps) => {
  const restored = useMemo(
    () => restoreSnapshot(snapshot, catalogs),
    [catalogs, snapshot],
  );

  const installedImplants = useMemo(
    () =>
      Object.entries(snapshot.implants)
        .filter(([, level]) => level > 0)
        .sort(([nameA, levelA], [nameB, levelB]) =>
          levelB === levelA ? nameA.localeCompare(nameB) : levelB - levelA,
        ),
    [snapshot.implants],
  );

  const isTwoHanded =
    restored.items.leftArm !== null &&
    restored.items.leftArm.id === restored.items.rightArm?.id &&
    (restored.items.leftArm.hands ?? 1) > 1;

  return (
    <div className={styles.sheet}>
      <section className={styles.block} aria-labelledby="sheet-profile">
        <h2 id="sheet-profile" className={styles.heading}>
          Profil
        </h2>
        <p className={styles.profile}>
          {snapshot.profile.race} · {GENDER_LABELS[snapshot.profile.gender]}
        </p>
      </section>

      <section className={styles.block} aria-labelledby="sheet-equipment">
        <h2 id="sheet-equipment" className={styles.heading}>
          Équipement et kits
        </h2>
        <ul className={styles.slots}>
          {ItemSpotValue.map((spot) => {
            const item = restored.items[spot];
            const kits = restored.kits[spot];
            const isSecondHand = spot === 'rightArm' && isTwoHanded;

            return (
              <li key={spot} className={styles.slot}>
                <span className={styles.slotLabel}>{SPOT_LABELS[spot]}</span>
                {item ? (
                  <div className={styles.item}>
                    <UiImage
                      src={item.image}
                      alt={item.name}
                      size={44}
                      fit="contain"
                      radius={4}
                    />
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {isSecondHand ? 'Arme à deux mains' : null}
                        {!isSecondHand && item.damageBonus
                          ? `Bonus de dégâts +${item.damageBonus}`
                          : null}
                        {!isSecondHand && item.minHeal !== undefined
                          ? ` Soin ${item.minHeal}–${item.maxHeal ?? item.minHeal}`
                          : null}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className={styles.empty}>Vide</p>
                )}
                {kits.length > 0 ? (
                  <ul className={styles.kits}>
                    {kits.map((selection, index) => (
                      <li key={`${selection.kit.id}-${index}`}>
                        Kit {selection.kit.name}
                        {selection.number > 1 ? ` ×${selection.number}` : ''}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="sheet-implants">
        <h2 id="sheet-implants" className={styles.heading}>
          Implants et drogue
        </h2>
        {installedImplants.length > 0 ? (
          <ul className={styles.implants}>
            {installedImplants.map(([name, level]) => (
              <li key={name}>
                {name} <strong>niv. {level}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Aucun implant</p>
        )}
        <p className={styles.drug}>
          Drogue : <strong>{restored.drug?.name ?? 'aucune'}</strong>
        </p>
      </section>

      <section className={styles.block} aria-labelledby="sheet-stats">
        <h2 id="sheet-stats" className={styles.heading}>
          Statistiques
        </h2>
        <dl className={styles.stats}>
          {(Object.keys(StatValues) as Stat[]).map((stat) => (
            <div key={stat} className={styles.stat}>
              <dt>
                <abbr title={StatValues[stat].label}>
                  {StatValues[stat].tag}
                </abbr>
                <span className={styles.statLabel}>
                  {StatValues[stat].label}
                </span>
              </dt>
              <dd>{formatStatValue(stats[stat] ?? 0)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};
