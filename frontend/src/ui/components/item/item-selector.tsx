import { Dialog } from '@base-ui-components/react';
import { useState } from 'react';

import { ItemCard } from './item-card';
import { ItemDialogSelector } from './item-dialog-selector';
import styles from './item-selector.module.css';

import type { Item } from '@/domain/item';

interface Props {
  type?: Item['type'];
}

export const ItemSelector = ({ type }: Props) => {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onItemSelect = (item: Item) => {
    setCurrentItem(item);
    setDialogOpen(false);
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.card} disabled={!!currentItem}>
        {currentItem ? <ItemCard item={currentItem} /> : 'Choisir un item'}
      </Dialog.Trigger>
      <ItemDialogSelector onItemSelect={onItemSelect} type={type} />
    </Dialog.Root>
  );
};
