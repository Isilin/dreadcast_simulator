import { Dialog } from '@base-ui-components/react';
import { Fragment, useMemo, useState } from 'react';

import { KitDialogSelector } from '../kit-dialog-selector';
import styles from './kit-selector.module.css';

import type { Item, Property } from '@/domain';
import { EffectChip } from '@/feature/effect-chip';
import { useSuit } from '@/ui/hooks/use-suit';
import type { SuitPiece } from '@/ui/providers/suit.provider';

interface Props {
  type: Item['type'];
}

export const KitSelector = ({ type }: Props) => {
  const suit = useSuit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const limitTech = useMemo(
    () => (suit[type as keyof typeof suit] as SuitPiece)?.item?.tech || 0,
    [suit, type],
  );
  const kits = useMemo(
    () => (suit[type as keyof typeof suit] as SuitPiece)?.kits,
    [suit, type],
  );
  const isEmpty = useMemo(() => kits?.length === 0, [kits]);

  const { techTotal, statTotals } = useMemo(() => {
    const totals = new Map<Property, number>();
    let tech = 0;
    kits?.forEach(({ kit, number }) => {
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
      <Dialog.Trigger className={styles.card}>
        {isEmpty ? (
          <div className={styles.placeholder}>Choisir un kit</div>
        ) : (
          <div className={styles.content}>
            <div className={styles.names}>
              {kits?.map(
                (k, i) =>
                  k.number > 0 && (
                    <Fragment key={k.kit.id}>
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
                  effect={{ property: stat, value: total }}
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
      <KitDialogSelector type={type} />
    </Dialog.Root>
  );
};
