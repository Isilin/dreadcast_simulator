import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

import styles from './EquipmentSlot.module.css';
import { isWeaponType, itemMatchsSpot } from '../../model/item.rules';
import {
  DAMAGE_BONUS_VALUES,
  type DamageBonusType,
  type Item,
} from '../../model/item.types';

import { StatValues, type ItemSpot, type StatModifier } from '@/domain';
import {
  PrerequisiteWarning,
  useUnmetPrerequisites,
} from '@/feature/prerequisite';
import { RemoveButton } from '@/ui/RemoveButton';
import { StatEffects } from '@/ui/StatEffects';

interface EquipmentSlotProps {
  spot: ItemSpot;
  spotLabel: string;
  item: Item | null;
  /** Kit management entry, shown under an equipped item. */
  kitControl?: ReactNode;
  /** Cumulative effects of the item and its kits. */
  effects?: StatModifier[];
  /** Right arm mirroring a two-handed weapon: shown greyed out. */
  isOffhand?: boolean;
  isActive: boolean;
  draggedItem: Item | null;
  onActivate: (spot: ItemSpot) => void;
  onDamageBonusChange: (bonus: DamageBonusType) => void;
  onRemove: () => void;
}

export const EquipmentSlot = ({
  spot,
  spotLabel,
  item,
  kitControl,
  effects = [],
  isOffhand = false,
  isActive,
  draggedItem,
  onActivate,
  onDamageBonusChange,
  onRemove,
}: EquipmentSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${spot}`,
    data: { kind: 'item-slot', spot },
  });
  const isValidDrop = Boolean(
    draggedItem && itemMatchsSpot(draggedItem.type, spot),
  );
  const isDragActive = draggedItem !== null;
  const hasUnmetPrerequisites =
    useUnmetPrerequisites(item?.prerequisites).length > 0 && !isOffhand;

  return (
    <section
      ref={setNodeRef}
      className={styles.slot}
      data-active={isActive}
      data-drop-over={isOver}
      data-drop-valid={isValidDrop}
      data-drop-invalid={isDragActive && !isValidDrop}
      data-drag-active={isDragActive}
      data-offhand={isOffhand}
      data-prerequisites-unmet={hasUnmetPrerequisites}
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
            {item ? (
              <img
                className={styles.visual}
                src={item.image}
                alt=""
                loading="lazy"
              />
            ) : null}
            <span className={styles.details}>
              <strong>{item?.name ?? 'Aucun équipement'}</strong>
              {isOffhand ? (
                <span>Tenue à deux mains</span>
              ) : (
                <span
                  title={
                    item
                      ? `Tech ${item.tech} · Intégrité ${item.integrity}`
                      : undefined
                  }
                >
                  {item
                    ? `Tech ${item.tech} · Intégrité ${item.integrity}`
                    : 'Déposez un équipement'}
                </span>
              )}
            </span>
          </span>
        </button>
        {item && isWeaponType(item.type) && !isOffhand ? (
          <label className={styles.damageControl}>
            <span>Dégâts</span>
            <select
              value={item.damageBonus ?? 0}
              onChange={(event) =>
                onDamageBonusChange(
                  Number(event.target.value) as DamageBonusType,
                )
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
      </div>
      {item && !isOffhand ? (
        <div
          className={styles.actions}
          data-with-warning={hasUnmetPrerequisites}
        >
          {hasUnmetPrerequisites ? (
            <PrerequisiteWarning prerequisites={item.prerequisites} />
          ) : null}
          {kitControl}
          <RemoveButton label={`Retirer ${item.name}`} onClick={onRemove} />
        </div>
      ) : null}
      {effects.length > 0 && !isOffhand ? (
        <div
          className={styles.effects}
          title={`Effets cumulés (équipement et kits) : ${effects
            .map(
              ({ property, value }) =>
                `${StatValues[property].tag} ${value > 0 ? '+' : ''}${value}`,
            )
            .join(', ')}`}
        >
          <StatEffects effects={effects} />
        </div>
      ) : null}
    </section>
  );
};
