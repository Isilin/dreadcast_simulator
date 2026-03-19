import type { Item, ItemType } from '../../model/item.types';
import { useItems } from '../../services';
import { ItemCard } from '../ItemCard';

import { Modal, Spinner } from '@/ui';

interface Props {
  type?: ItemType[];
  onItemSelect: (item: Item) => void;
  selected: Item | null;
}

export const ItemDialogSelector = ({ onItemSelect, type, selected }: Props) => {
  const { data: items, status, error } = useItems(type);

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>Choisissez un item</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status === 'pending' && <Spinner size={32} />}
        {status === 'success' &&
          items?.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemSelect(item)}
              selected={selected?.id === item.id}
            />
          ))}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close />
      </Modal.Footer>
    </Modal>
  );
};
