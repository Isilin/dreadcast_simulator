import { useDroppable } from '@dnd-kit/core';

import styles from './DrugEquipmentSlot.module.css';
import type { Drug } from '../../model/drug.types';

import { TrashIcon } from '@/ui/Icon';

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
      {drug ? (
        <button
          type="button"
          className={styles.remove}
          onClick={onClear}
          aria-label={`Désactiver ${drug.name}`}
          title={`Désactiver ${drug.name}`}
        >
          <TrashIcon />
        </button>
      ) : null}
    </section>
  );
};
