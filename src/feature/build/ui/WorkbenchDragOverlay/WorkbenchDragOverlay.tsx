import { DragOverlay } from '@dnd-kit/core';

import styles from './WorkbenchDragOverlay.module.css';
import { getDragLabel } from '../../model/drag-drop.helpers';
import type { WorkbenchDragData } from '../../model/drag-drop.types';

import { GripIcon } from '@/ui/Icon';

interface WorkbenchDragOverlayProps {
  dragData: WorkbenchDragData | null;
}

const getDragImage = (dragData: WorkbenchDragData): string | null => {
  if (dragData.kind === 'item') return dragData.item.image;
  if (dragData.kind === 'drug') return dragData.drug.image || null;
  return null;
};

const getDragDetail = (dragData: WorkbenchDragData): string => {
  if (dragData.kind === 'item') return 'Équipement';
  if (dragData.kind === 'kit') return `Kit · Tech ${dragData.kit.tech}`;
  return 'Drogue';
};

/** Card that follows the pointer while an element is dragged. */
export const WorkbenchDragOverlay = ({
  dragData,
}: WorkbenchDragOverlayProps) => {
  const image = dragData ? getDragImage(dragData) : null;

  return (
    <DragOverlay dropAnimation={null}>
      {dragData ? (
        <div className={styles.overlay}>
          <span className={styles.grip} aria-hidden="true">
            <GripIcon />
          </span>
          {image ? <img src={image} alt="" className={styles.image} /> : null}
          <span className={styles.text}>
            <strong>{getDragLabel(dragData)}</strong>
            <small>{getDragDetail(dragData)}</small>
          </span>
        </div>
      ) : null}
    </DragOverlay>
  );
};
