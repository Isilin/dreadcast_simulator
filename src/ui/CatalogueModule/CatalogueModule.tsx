import { useDraggable, type Data } from '@dnd-kit/core';
import type { ReactNode } from 'react';

import styles from './CatalogueModule.module.css';

interface CatalogueModuleProps {
  id: string;
  dragData: Data;
  name: string;
  detail: string;
  /** Extra content under the detail line (e.g. stat effects). */
  children?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

/** Catalogue card that can be clicked or dragged as a whole. */
export const CatalogueModule = ({
  id,
  dragData,
  name,
  detail,
  children,
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
        ref={setNodeRef}
        type="button"
        className={styles.select}
        onClick={onClick}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <span className={styles.name}>{name}</span>
        <small className={styles.detail}>{detail}</small>
        {children}
      </button>
    </article>
  );
};
