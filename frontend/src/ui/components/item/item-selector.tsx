import { Dialog } from '@base-ui-components/react';
import { useMemo, useState } from 'react';

import { ItemCard } from './item-card';
import { ItemDialogSelector } from './item-dialog-selector';
import styles from './item-selector.module.css';

import { toType, type Item, type ItemSpot } from '@/domain/item';
import { useSuit } from '@/ui/hooks/use-suit';

interface Props {
  spot: ItemSpot;
}

export const ItemSelector = ({ spot }: Props) => {
  const suit = useSuit();
  const item = useMemo(() => {
    return suit[spot]?.item;
  }, [suit, spot]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onItemSelect = (item: Item) => {
    suit.setItem(item, spot);
    setDialogOpen(false);
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card}>
        {item ? <ItemCard item={item} /> : 'Choisir un item'}
      </Dialog.Trigger>
      <ItemDialogSelector onItemSelect={onItemSelect} type={toType(spot)} />
    </Dialog.Root>
  );
};
