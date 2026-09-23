import { useDraggable, type Data } from '@dnd-kit/core';

import styles from './DraggableModuleRow.module.css';

import { GripIcon } from '@/ui/Icon';

interface DraggableModuleRowProps {
  id: string;
  dragData: Data;
  name: string;
  detail: string;
  onRemove: () => void;
}

export const DraggableModuleRow = ({
  id,
  dragData,
  name,
  detail,
  onRemove,
}: DraggableModuleRowProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: dragData,
  });

  return (
    <div className={styles.row}>
      <span>{name}</span>
      <small>{detail}</small>
      <button
        ref={setNodeRef}
        type="button"
        className={styles.dragHandle}
        aria-label={`Glisser ${name} vers la zone de retrait`}
        title={`Glisser ${name} vers la zone de retrait`}
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <button type="button" onClick={onRemove} aria-label={`Retirer ${name}`}>
        Retirer
      </button>
    </div>
  );
};
