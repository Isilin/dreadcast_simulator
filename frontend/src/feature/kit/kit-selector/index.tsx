import { Dialog } from '@base-ui-components/react';
import { Fragment, useMemo, useState } from 'react';

import { KitDialogSelector } from '../kit-dialog-selector';
import styles from './kit-selector.module.css';

import { StatValues, type Stat } from '@/domain/stats';
import { type ItemSpot } from '@/domain/suit';
import { useItemsState } from '@/feature/item';
import { EffectChip } from '@/ui/effect-chip';
import { useSuit } from '@/ui/hooks/use-suit';

interface Props {
  spot: ItemSpot;
}

export const KitSelector = ({ spot }: Props) => {
  const suit = useSuit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = useItemsState();
  const limitTech = useMemo(() => items[spot]?.tech || 0, [items, spot]);
  const kits = useMemo(() => suit[spot], [suit, spot]);
  const isEmpty = useMemo(() => kits?.length === 0, [kits]);
  const isDisable = useMemo(() => items[spot] === null, [items, spot]);

  const { techTotal, statTotals } = useMemo(() => {
    const totals = new Map<Stat, number>();
    let tech = 0;
    kits?.forEach?.(({ kit, number }) => {
      tech += kit.tech * number;
      kit.effects.forEach((eff) => {
        totals.set(
          eff.property,
          (totals.get(eff.property) ?? 0) + eff.value * number,
        );
      });
    });
    return {
      techTotal: limitTech - tech,
      statTotals: Array.from(totals.entries()).filter(([, v]) => v !== 0),
    };
  }, [kits, limitTech]);
  const techEval = useMemo(() => {
    if (techTotal > 40) return styles.missingTech;
    if (techTotal < 0) return styles.overTech;
    if (techTotal === 0) return styles.perfectTech;
    return '';
  }, [techTotal]);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card} disabled={isDisable}>
        {isEmpty ? (
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
              {statTotals.map(([stat, total]) => (
                <EffectChip
                  value={total}
                  label={StatValues[stat].label}
                  key={stat}
                />
              ))}
            </div>
            <div className={styles.footer}>
              <span className={styles.techLabel}>Tech :</span>
              <span className={`${styles.techValue} ${techEval}`}>
                {techTotal}
              </span>
            </div>
          </div>
        )}
      </Dialog.Trigger>
      <KitDialogSelector spot={spot} />
    </Dialog.Root>
  );
};
