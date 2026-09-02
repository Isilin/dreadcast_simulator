import { useDraggable, useDroppable } from '@dnd-kit/core';

import styles from './DrugEquipmentSlot.module.css';
import type { Drug } from '../../model/drug.types';

import { GripIcon } from '@/ui/Icon';

interface DraggedData {
  kind: string;
}

interface DrugEquipmentSlotProps {
  drug: Drug | null;
  isActive: boolean;
  draggedData: DraggedData | null;
  onActivate: () => void;
  onClear: () => void;
}

export const DrugEquipmentSlot = ({
  drug,
  isActive,
  draggedData,
  onActivate,
  onClear,
}: DrugEquipmentSlotProps) => {
  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: 'drug-slot',
    data: { kind: 'drug-slot' },
  });
  const installedDragData = drug
    ? { kind: 'drug' as const, drug, source: 'installed' as const }
    : null;
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    isDragging,
  } = useDraggable({
    id: installedDragData
      ? `active-drug-${installedDragData.drug.id}`
      : 'active-drug-empty',
    data: installedDragData ?? undefined,
    disabled: installedDragData === null,
  });
  const isDragActive =
    draggedData?.kind === 'item' || draggedData?.kind === 'drug';
  const isValidDrop = draggedData?.kind === 'drug';

  return (
    <section
      ref={setDropNodeRef}
      className={styles.slot}
      data-active={isActive}
      data-drop-over={isOver}
      data-drop-valid={isValidDrop}
      data-drop-invalid={isDragActive && !isValidDrop}
      data-drag-active={isDragActive}
      aria-label="Emplacement drogue"
    >
      <button
        type="button"
        className={styles.control}
        onClick={onActivate}
        aria-label="Sélectionner l’emplacement drogue"
        aria-pressed={isActive}
      >
        <span className={styles.name}>Drogue</span>
        <span className={styles.summary} data-empty={!drug}>
          <strong>{drug?.name ?? 'Aucune drogue active'}</strong>
          <span>{drug ? 'Substance active' : 'Déposez une drogue'}</span>
          <small>1 emplacement</small>
        </span>
      </button>
      {installedDragData ? (
        <div className={styles.actions}>
          <button
            ref={setDragNodeRef}
            type="button"
            className={styles.dragHandle}
            aria-label={`Glisser ${installedDragData.drug.name} vers la zone de retrait`}
            title={`Glisser ${installedDragData.drug.name} vers la zone de retrait`}
            data-dragging={isDragging}
            {...attributes}
            {...listeners}
          >
            <GripIcon />
          </button>
          <button type="button" onClick={onClear}>
            Désactiver
          </button>
        </div>
      ) : null}
    </section>
  );
};
