import { Dialog } from '@base-ui/react';
import { memo, useState } from 'react';

import { getItemTypes, useItemsActions, useItemsState } from '../../model';
import type { Item } from '../../model/item.types';
import { ItemCard } from '../ItemCard';
import { ItemDialogSelector } from '../ItemDialogSelector';
import styles from './ItemSelector.module.css';

import { type ItemSpot } from '@/domain';
import { useKitsActions } from '@/feature/kit';
import { useBuildReadOnlyMode } from '@/feature/persistence';
import { Card } from '@/ui';

interface Props {
  spot: ItemSpot;
}

export const ItemSelector = memo(({ spot }: Props) => {
  const actions = useItemsActions();
  const kitActions = useKitsActions();
  const items = useItemsState();
  const isReadOnly = useBuildReadOnlyMode();
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
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger className={styles.wrapper} disabled={isReadOnly}>
        {items[spot] ? (
          <ItemCard item={items[spot]} variant="slot" />
        ) : (
          <Card
            className={styles.card}
            state={isReadOnly ? 'disable' : 'default'}
          >
            Choisir un item
          </Card>
        )}
      </Dialog.Trigger>
      <ItemDialogSelector
        onItemSelect={onItemSelect}
        type={getItemTypes(spot)}
        selected={items[spot]}
      />
    </Dialog.Root>
  );
});
