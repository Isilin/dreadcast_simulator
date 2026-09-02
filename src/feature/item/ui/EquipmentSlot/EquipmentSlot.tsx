import { useDroppable } from '@dnd-kit/core';

import styles from './EquipmentSlot.module.css';
import { isWeaponType, itemMatchsSpot } from '../../model/item.rules';
import {
  DAMAGE_BONUS_VALUES,
  type DamageBonusType,
  type Item,
} from '../../model/item.types';

import type { ItemSpot } from '@/domain';
import { WrenchIcon } from '@/ui/Icon';

interface EquipmentSlotProps {
  spot: ItemSpot;
  spotLabel: string;
  item: Item | null;
  kitCount: number;
  isActive: boolean;
  draggedItem: Item | null;
  onActivate: (spot: ItemSpot) => void;
  onKitOpen: (spot: ItemSpot) => void;
  onDamageBonusChange: (bonus: DamageBonusType) => void;
}

export const EquipmentSlot = ({
  spot,
  spotLabel,
  item,
  kitCount,
  isActive,
  draggedItem,
  onActivate,
  onKitOpen,
  onDamageBonusChange,
}: EquipmentSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${spot}`,
    data: { kind: 'item-slot', spot },
  });
  const isValidDrop = Boolean(
    draggedItem && itemMatchsSpot(draggedItem.type, spot),
  );
  const isDragActive = draggedItem !== null;
  const isKitDisabled =
    !item ||
    (spot === 'rightArm' && item.hands !== undefined && item.hands >= 2);

  return (
    <section
      ref={setNodeRef}
      className={styles.slot}
      data-active={isActive}
      data-drop-over={isOver}
      data-drop-valid={isValidDrop}
      data-drop-invalid={isDragActive && !isValidDrop}
      data-drag-active={isDragActive}
      aria-label={`Emplacement ${spotLabel}`}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.control}
          onClick={() => onActivate(spot)}
          aria-label={`Sélectionner ${spotLabel}`}
          aria-pressed={isActive}
        >
          <span className={styles.name}>{spotLabel}</span>
          <span className={styles.summary} data-empty={!item}>
            <strong>{item?.name ?? 'Aucun équipement'}</strong>
            <span>
              {item
                ? `Tech ${item.tech} · Intégrité ${item.integrity}`
                : 'Déposez un équipement'}
            </span>
            <small>
              {kitCount
                ? `${kitCount} kit${kitCount > 1 ? 's' : ''}`
                : 'Aucun kit'}
            </small>
          </span>
        </button>
        <button
          type="button"
          className={styles.kitButton}
          disabled={isKitDisabled}
          onClick={() => onKitOpen(spot)}
          aria-label={`Gérer les kits de ${spotLabel}`}
        >
          <WrenchIcon />
        </button>
      </div>
      {item && isWeaponType(item.type) ? (
        <label className={styles.damageControl}>
          <span>Dégâts</span>
          <select
            value={item.damageBonus ?? 0}
            onChange={(event) =>
              onDamageBonusChange(Number(event.target.value) as DamageBonusType)
            }
          >
            {DAMAGE_BONUS_VALUES.map((bonus) => (
              <option key={bonus} value={bonus}>
                +{bonus}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </section>
  );
};
