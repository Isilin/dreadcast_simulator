import { Dialog } from '@base-ui-components/react';

import { ItemCard } from './item-card';

import { useItems } from '@/data/item/item.queries';
import type { Item } from '@/domain/item';
import { Modal } from '@/ui/components/modal/modal';
import { Spinner } from '@/ui/components/spinner/spinner';

interface Props {
  type?: Item['type'];
  onItemSelect: (item: Item) => void;
}

export const ItemDialogSelector = ({ onItemSelect, type }: Props) => {
  const { data: items, status, error } = useItems(type);

  return (
    <Modal>
      <Modal.Header>
        <Dialog.Title>Choisissez un item</Dialog.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status === 'pending' && <Spinner />}
        {status === 'success' &&
          items?.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemSelect(item)}
            />
          ))}
      </Modal.Content>
      <Modal.Footer>
        <Dialog.Close>Close</Dialog.Close>
      </Modal.Footer>
    </Modal>
  );
};
