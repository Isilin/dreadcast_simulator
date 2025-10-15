import { Dialog } from '@base-ui-components/react';
import { Fragment, useMemo, useState } from 'react';

import { useKitsOnSpot } from '../../model/kit.selectors';
import { KitDialogSelector } from '../KitDialogSelector';
import styles from './KitSelector.module.css';

import { StatValues, type ItemSpot, type Stat } from '@/domain';
import { useItemsState } from '@/feature/item';
import { EffectChip } from '@/ui/effect-chip';

interface Props {
  spot: ItemSpot;
}

export const KitSelector = ({ spot }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = useItemsState();
  const limitTech = useMemo(() => items[spot]?.tech || 0, [items, spot]);
  const { kits, noKits, techCost, totalEffect } = useKitsOnSpot(spot);
  const isDisable = useMemo(() => items[spot] === null, [items, spot]);

  const techTotal = useMemo(() => limitTech - techCost, [limitTech, techCost]);
  const techEval = useMemo(() => {
    if (techTotal > 40) return styles.missingTech;
    if (techTotal < 0) return styles.overTech;
    if (techTotal === 0) return styles.perfectTech;
    return '';
  }, [techTotal]);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card} disabled={isDisable}>
        {noKits ? (
          <div className={styles.placeholder}>Choisir un kit</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.names}>
              {kits?.map(
                (k, i) =>
                  k.number > 0 && (
                    <Fragment key={`${i}-${k.kit.id}`}>
                      <span className={styles.name}>
                        {k.kit.name}
                        {k.number > 1 && <sup className={styles.sup}>{k.number}</sup>}
                      </span>
                      {i < kits.length - 1 && <span className={styles.sep}> </span>}
                    </Fragment>
                  )
              )}
            </div>
            <div className={styles.effects}>
              {Object.entries(totalEffect)
                .filter((stat) => stat[1] !== 0)
                .map(([stat, total]) => (
                  <EffectChip value={total} tag={StatValues[stat as Stat].tag} key={stat} />
                ))}
            </div>
            <div className={styles.footer}>
              <span className={styles.techLabel}>Tech :</span>
              <span className={`${styles.techValue} ${techEval}`}>{techTotal}</span>
            </div>
          </div>
        )}
      </Dialog.Trigger>
      <KitDialogSelector spot={spot} />
    </Dialog.Root>
  );
};
