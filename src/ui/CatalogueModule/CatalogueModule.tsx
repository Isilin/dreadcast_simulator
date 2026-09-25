import { useDraggable, type Data } from '@dnd-kit/core';
import type { ReactNode } from 'react';

import styles from './CatalogueModule.module.css';
import { GripIcon } from '../Icon';

interface CatalogueModuleProps {
  id: string;
  dragData: Data;
  name: string;
  detail: string;
  /** Visual shown above the name. */
  image?: string;
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
  image,
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
        data-with-visual={Boolean(image)}
        onClick={onClick}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        {disabled ? null : (
          <span className={styles.grip} aria-hidden="true">
            <GripIcon />
          </span>
        )}
        {image ? (
          <img className={styles.visual} src={image} alt="" loading="lazy" />
        ) : null}
        <span className={styles.name}>{name}</span>
        <small className={styles.detail}>{detail}</small>
        {children}
      </button>
    </article>
  );
};
