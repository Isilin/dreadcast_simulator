import { Dialog } from '@base-ui-components/react';

import type { Item, ItemType } from '../../model/item.types';
import { useItems } from '../../services';
import { ItemCard } from '../ItemCard/ItemCard';

import { Modal } from '@/ui/Modal/Modal';

interface Props {
  type?: ItemType[];
  onItemSelect: (item: Item) => void;
}

// TODO : allow to deselect item
// TODO : remove kits on deselect
export const ItemDialogSelector = ({ onItemSelect, type }: Props) => {
  const { data: items, status, error } = useItems(type);

  return (
    <Modal>
      <Modal.Header>
        <Dialog.Title>Choisissez un item</Dialog.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status !== 'error' &&
          items?.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => onItemSelect(item)} />
          ))}
      </Modal.Content>
      <Modal.Footer>
        <Dialog.Close>Close</Dialog.Close>
      </Modal.Footer>
    </Modal>
  );
};
