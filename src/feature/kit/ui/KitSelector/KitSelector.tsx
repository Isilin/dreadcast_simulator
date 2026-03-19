import { Fragment, memo, useMemo, useState } from 'react';

import { useKitsOnSpot } from '../../model/kit.selectors';
import { KitDialogSelector } from '../KitDialogSelector';
import styles from './KitSelector.module.css';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { StatValues, type ItemSpot, type Stat } from '@/domain';
import { useItemsState } from '@/feature/item';
import { Card, EffectChip } from '@/ui';
import { StatusCounterBadge } from '@/ui/StatusCounterBadge';

interface Props {
  spot: ItemSpot;
}

export const KitSelector = memo(({ spot }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = useItemsState();
  const limitTech = useMemo(() => items[spot]?.tech || 0, [items, spot]);
  const { kits, noKits, techCost, totalEffect } = useKitsOnSpot(spot);
  const isDisable = useMemo(
    () =>
      !items[spot] ||
      (spot === 'rightArm' &&
        items[spot].hands !== undefined &&
        items[spot].hands >= 2),
    [items, spot],
  );

  const techTotal = useMemo(() => limitTech - techCost, [limitTech, techCost]);
  const techStatus = useMemo(() => {
    if (techTotal > 40) return 'warning';
    if (techTotal < 0) return 'error';
    if (techTotal === 0) return 'info';
    return 'default';
  }, [techTotal]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className={styles.wrapper} disabled={isDisable}>
        {noKits ? (
          <Card
            className={styles.card}
            state={isDisable ? 'disable' : 'default'}
          >
            Choisir un kit
          </Card>
        ) : (
          <Card state={techStatus}>
            <div className={styles.names}>
              {kits?.map(
                (k, i) =>
                  k.number > 0 && (
                    <Fragment key={`${i}-${k.kit.id}`}>
                      <span className={styles.name}>
                        {k.kit.name}
                        {k.number > 1 && (
                          <sup className={styles.sup}>{k.number}</sup>
                        )}
                      </span>
                      {i < kits.length - 1 && (
                        <span className={styles.sep}> </span>
                      )}
                    </Fragment>
                  ),
              )}
            </div>
            <div className={styles.effects}>
              {Object.entries(totalEffect)
                .filter((stat) => stat[1] !== 0)
                .map(([stat, total]) => (
                  <EffectChip
                    value={total}
                    tag={StatValues[stat as Stat].tag}
                    name={StatValues[stat as Stat].label}
                    key={stat}
                  />
                ))}
            </div>
            <div className={styles.footer}>
              <span className={styles.techLabel}>Tech :</span>
              <StatusCounterBadge
                value={techTotal}
                maxValue={limitTech}
                variant="invoice"
              />
            </div>
          </Card>
        )}
      </DialogTrigger>
      <KitDialogSelector spot={spot} />
    </Dialog>
  );
});
