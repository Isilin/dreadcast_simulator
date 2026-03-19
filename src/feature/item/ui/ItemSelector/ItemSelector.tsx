import { memo, useState } from 'react';

import { getItemTypes, useItemsActions, useItemsState } from '../../model';
import type { Item } from '../../model/item.types';
import { ItemCard } from '../ItemCard';
import { ItemDialogSelector } from '../ItemDialogSelector';
import styles from './ItemSelector.module.css';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { type ItemSpot } from '@/domain';
import { useKitsActions } from '@/feature/kit';
import { Card } from '@/ui';

interface Props {
  spot: ItemSpot;
}

export const ItemSelector = memo(({ spot }: Props) => {
  const actions = useItemsActions();
  const kitActions = useKitsActions();
  const items = useItemsState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onItemSelect = (item: Item) => {
    if (items[spot]?.id === item.id) {
      actions.resetItem(spot);
      kitActions.resetKits(spot);
    } else {
      actions.setItem(spot, item);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className={styles.wrapper}>
        {items[spot] ? (
          <ItemCard item={items[spot]} variant="slot" />
        ) : (
          <Card className={styles.card}>Choisir un item</Card>
        )}
      </DialogTrigger>
      <ItemDialogSelector
        onItemSelect={onItemSelect}
        type={getItemTypes(spot)}
        selected={items[spot]}
      />
    </Dialog>
  );
});
