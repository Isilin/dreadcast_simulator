import { Dialog } from '@base-ui-components/react';
import { useState } from 'react';

import { getItemTypes, useItemsDispatch, useItemsState } from '../../model';
import type { Item } from '../../model/item.types';
import { ItemCard } from '../ItemCard';
import { ItemDialogSelector } from '../ItemDialogSelector';
import styles from './ItemSelector.module.css';

import { type ItemSpot } from '@/domain';

interface Props {
  spot: ItemSpot;
}

export const ItemSelector = ({ spot }: Props) => {
  const dispatch = useItemsDispatch();
  const items = useItemsState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onItemSelect = (item: Item) => {
    dispatch.setItem(spot, item);
    setDialogOpen(false);
  };
  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.wrapper}>
        {items[spot] ? (
          <ItemCard item={items[spot]} variant="slot" />
        ) : (
          <div className={styles.card}>Choisir un item</div>
        )}
      </Dialog.Trigger>
      <ItemDialogSelector
        onItemSelect={onItemSelect}
        type={getItemTypes(spot)}
      />
    </Dialog.Root>
  );
};
