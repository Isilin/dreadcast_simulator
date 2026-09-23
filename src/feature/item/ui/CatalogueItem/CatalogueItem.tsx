import { useDraggable } from '@dnd-kit/core';

import styles from './CatalogueItem.module.css';
import type { Item } from '../../model/item.types';

interface CatalogueItemProps {
  item: Item;
  spotLabel: string;
  onEquip: (item: Item) => void;
}

export const CatalogueItem = ({
  item,
  spotLabel,
  onEquip,
}: CatalogueItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: { kind: 'item', item },
  });

  return (
    <article className={styles.item} data-dragging={isDragging}>
      <button
        ref={setNodeRef}
        type="button"
        className={styles.select}
        onClick={() => onEquip(item)}
        title={`Équiper ${item.name} sur ${spotLabel}`}
        {...attributes}
        {...listeners}
      >
        <img src={item.image} alt="" loading="lazy" />
        <span className={styles.name}>{item.name}</span>
        <span className={styles.meta}>
          Tech {item.tech} · Intégrité {item.integrity}
        </span>
      </button>
    </article>
  );
};
