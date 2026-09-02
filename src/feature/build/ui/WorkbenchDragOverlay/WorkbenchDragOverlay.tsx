import { DragOverlay } from '@dnd-kit/core';

import styles from './WorkbenchDragOverlay.module.css';
import { getDragLabel } from '../../model/drag-drop.helpers';
import type { WorkbenchDragData } from '../../model/drag-drop.types';

interface WorkbenchDragOverlayProps {
  dragData: WorkbenchDragData | null;
}

export const WorkbenchDragOverlay = ({
  dragData,
}: WorkbenchDragOverlayProps) => (
  <DragOverlay dropAnimation={null}>
    {dragData ? (
      <div className={styles.overlay}>
        {getDragLabel(dragData)}
      </div>
    ) : null}
  </DragOverlay>
);
