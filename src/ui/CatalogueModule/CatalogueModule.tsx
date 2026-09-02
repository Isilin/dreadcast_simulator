import { useDraggable, type Data } from '@dnd-kit/core';

import styles from './CatalogueModule.module.css';

import { GripIcon } from '@/ui/Icon';

interface CatalogueModuleProps {
  id: string;
  dragData: Data;
  name: string;
  detail: string;
  disabled?: boolean;
  onClick: () => void;
}

export const CatalogueModule = ({
  id,
  dragData,
  name,
  detail,
  disabled = false,
  onClick,
}: CatalogueModuleProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: dragData,
    disabled,
  });

  return (
    <article className={styles.module} data-dragging={isDragging}>
      <button
        type="button"
        className={styles.select}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{name}</span>
        <small>{detail}</small>
      </button>
      <button
        ref={setNodeRef}
        type="button"
        className={styles.dragHandle}
        aria-label={`Glisser ${name}`}
        title={`Glisser ${name}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
    </article>
  );
};
