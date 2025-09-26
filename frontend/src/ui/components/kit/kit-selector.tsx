import { Dialog } from '@base-ui-components/react';
import { useMemo, useState } from 'react';

import { KitDialogSelector } from './kit-dialog-selector';
import styles from './kit-selector.module.css';

import type { Item } from '@/domain/item';
import { useSuit } from '@/ui/hooks/use-suit';
import type { SuitPiece } from '@/ui/providers/suit.provider';

interface Props {
  type: Item['type'];
}

export const KitSelector = ({ type }: Props) => {
  const suit = useSuit();
  const [dialogOpen, setDialogOpen] = useState(false);
  const kits = useMemo(
    () => (suit[type as keyof typeof suit] as SuitPiece)?.kits,
    [suit, type],
  );
  const hasKits = useMemo(() => kits?.length > 0, [kits]) || false;

  const name = useMemo(() => {
    return kits
      ?.reduce(
        (acc, kit) =>
          acc +
          kit.kit.name +
          (kit.number > 1 ? kit.number.toString() : '') +
          ' ',
        '',
      )
      .trim();
  }, [kits]);

  const tech = useMemo(() => {
    return kits?.reduce((acc, kit) => acc + kit.kit.tech * kit.number, 0);
  }, [kits]);

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card}>
        {hasKits ? (
          <div className={styles.Card}>
            <h2 className={styles.Title}>{name}</h2>
            <h5 className={styles.Tech}>Tech : {tech}</h5>
            <h5>Type : {type}</h5>
            <span></span>
          </div>
        ) : (
          'Choisir un kit'
        )}
      </Dialog.Trigger>
      <KitDialogSelector type={type} />
    </Dialog.Root>
  );
};
