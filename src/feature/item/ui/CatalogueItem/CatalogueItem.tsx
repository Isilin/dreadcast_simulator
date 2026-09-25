import { useDraggable } from '@dnd-kit/core';

import styles from './CatalogueItem.module.css';
import type { Item } from '../../model/item.types';

import { PrerequisiteWarning } from '@/feature/prerequisite';
import { GripIcon } from '@/ui/Icon';
import { StatEffects } from '@/ui/StatEffects';
import { sumStatModifiers } from '@/utils/stats';

interface CatalogueItemProps {
  item: Item;
  spotLabel: string;
  /** False shows a red warning with the missing prerequisites. */
  prerequisitesMet?: boolean;
  onEquip: (item: Item) => void;
}

export const CatalogueItem = ({
  item,
  spotLabel,
  prerequisitesMet = true,
  onEquip,
}: CatalogueItemProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: { kind: 'item', item },
  });

  return (
    <article
      className={styles.item}
      data-dragging={isDragging}
      data-prerequisites-unmet={!prerequisitesMet}
    >
      <button
        ref={setNodeRef}
        type="button"
        className={styles.select}
        onClick={() => onEquip(item)}
        title={`Équiper ${item.name} sur ${spotLabel}`}
        {...attributes}
        {...listeners}
      >
        <span className={styles.grip} aria-hidden="true">
          <GripIcon />
        </span>
        <img src={item.image} alt="" loading="lazy" />
        <span className={styles.name}>{item.name}</span>
        <span className={styles.meta}>
          Tech {item.tech} · Intégrité {item.integrity}
        </span>
        <StatEffects effects={sumStatModifiers(item.effects ?? [])} inline />
      </button>
      {prerequisitesMet ? null : (
        <PrerequisiteWarning
          prerequisites={item.prerequisites}
          className={styles.prerequisites}
        />
      )}
    </article>
  );
};
