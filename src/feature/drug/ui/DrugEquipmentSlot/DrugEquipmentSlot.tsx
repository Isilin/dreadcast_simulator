import { useDroppable } from '@dnd-kit/core';

import styles from './DrugEquipmentSlot.module.css';
import type { Drug } from '../../model/drug.types';

import { StatValues } from '@/domain';
import { RemoveButton } from '@/ui/RemoveButton';
import { StatEffects } from '@/ui/StatEffects';

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
      <div className={styles.header}>
        <button
          type="button"
          className={styles.control}
          onClick={onActivate}
          aria-label="Sélectionner l’emplacement drogue"
          aria-pressed={isActive}
        >
          <span className={styles.name}>Drogue</span>
          <span className={styles.summary} data-empty={!drug}>
            {drug ? (
              <img
                className={styles.visual}
                src={drug.image}
                alt=""
                loading="lazy"
              />
            ) : null}
            <span className={styles.details}>
              <strong>{drug?.name ?? 'Aucune drogue active'}</strong>
              <span>{drug ? 'Substance active' : 'Déposez une drogue'}</span>
              <small>1 emplacement</small>
            </span>
          </span>
        </button>
        {drug ? (
          <RemoveButton
            className={styles.remove}
            label={`Désactiver ${drug.name}`}
            onClick={onClear}
          />
        ) : null}
      </div>
      {drug && drug.sideEffects.length > 0 ? (
        <div
          className={styles.effects}
          title={`Effets de la drogue : ${drug.sideEffects
            .map(
              ({ property, value }) =>
                `${StatValues[property].tag} ${value > 0 ? '+' : ''}${value}`,
            )
            .join(', ')}`}
        >
          <StatEffects effects={drug.sideEffects} />
        </div>
      ) : null}
    </section>
  );
};
