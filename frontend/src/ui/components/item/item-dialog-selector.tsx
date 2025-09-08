import { Dialog } from '@base-ui-components/react';

import { ItemCard } from './item-card';
import styles from './item-dialog-selector.module.css';

import { useItems } from '@/data/item/item.queries';
import type { Item } from '@/domain/item';

interface Props {
  type?: Item['type'];
  onItemSelect: (item: Item) => void;
}

export const ItemDialogSelector = ({ onItemSelect, type }: Props) => {
  const { data: items, status, error } = useItems(type);

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.Backdrop} />
      <Dialog.Popup className={styles.Popup}>
        <Dialog.Title>Choisissez un item</Dialog.Title>
        <div className={styles.content}>
          {status === 'error' && <p>{error.message}</p>}
          {status === 'pending' && <p>Loading...</p>}
          {status === 'success' &&
            items?.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onItemSelect(item)}
              />
            ))}
        </div>
        <div className={styles.Actions}>
          <Dialog.Close className={styles.Button}>Close</Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  );
};
