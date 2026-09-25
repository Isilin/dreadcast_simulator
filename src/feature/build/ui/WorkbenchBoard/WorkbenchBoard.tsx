import styles from './WorkbenchBoard.module.css';
import type { WorkbenchDragData } from '../../model/drag-drop.types';
import { computeSlotEffects } from '../../model/slot-effects';
import type { CatalogueFilter } from '../../model/workbench.types';
import {
  bodySlots,
  weaponSlots,
  workbenchSlotLabels,
} from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import {
  DrugEquipmentSlot,
  type Drug,
} from '@/feature/drug';
import {
  type DamageBonusType,
  type ItemsState,
  EquipmentSlot,
  isTwoHandedOffhand,
} from '@/feature/item';
import { KitBudgetButton, type KitsState } from '@/feature/kit';
import { Silhouette } from '@/feature/profile';

interface WorkbenchBoardProps {
  items: ItemsState;
  kitsBySpot: KitsState;
  activeSpot: ItemSpot;
  draggedData: WorkbenchDragData | null;
  selectedDrug: Drug | null;
  catalogueFilter: CatalogueFilter;
  onActivateSpot: (spot: ItemSpot) => void;
  onKitOpen: (spot: ItemSpot) => void;
  onDamageBonusChange: (spot: ItemSpot, bonus: DamageBonusType) => void;
  onItemRemove: (spot: ItemSpot) => void;
  onDrugActivate: () => void;
  onDrugClear: () => void;
}

export const WorkbenchBoard = ({
  items,
  kitsBySpot,
  activeSpot,
  draggedData,
  selectedDrug,
  catalogueFilter,
  onActivateSpot,
  onKitOpen,
  onDamageBonusChange,
  onItemRemove,
  onDrugActivate,
  onDrugClear,
}: WorkbenchBoardProps) => {
  const renderEquipmentSlot = (spot: ItemSpot) => {
    const isOffhand = isTwoHandedOffhand(items, spot);
    const item = items[spot];

    return (
      <EquipmentSlot
        key={spot}
        spot={spot}
        spotLabel={workbenchSlotLabels[spot]}
        item={item}
        kitControl={
          item ? (
            <KitBudgetButton
              itemTech={item.tech}
              kits={kitsBySpot[spot]}
              spotLabel={workbenchSlotLabels[spot]}
              onOpen={() => onKitOpen(spot)}
            />
          ) : null
        }
        effects={
          isOffhand ? [] : computeSlotEffects(item, kitsBySpot[spot])
        }
        isOffhand={isOffhand}
        isActive={catalogueFilter !== 'drugs' && activeSpot === spot}
        draggedItem={draggedData?.kind === 'item' ? draggedData.item : null}
        onActivate={onActivateSpot}
        onDamageBonusChange={(bonus) => onDamageBonusChange(spot, bonus)}
        onRemove={() => onItemRemove(spot)}
      />
    );
  };

  return (
    <div className={styles.board}>
      <div className={styles.bodySlots}>{bodySlots.map(renderEquipmentSlot)}</div>
      <div className={styles.centerBoard}>
        <div className={styles.silhouette} aria-hidden="true">
          <Silhouette />
        </div>
      </div>
      <div className={styles.rightBoard}>
        <DrugEquipmentSlot
          drug={selectedDrug}
          isActive={catalogueFilter === 'drugs'}
          draggedData={draggedData}
          onActivate={onDrugActivate}
          onClear={onDrugClear}
        />
        <div className={styles.weaponSlots}>{weaponSlots.map(renderEquipmentSlot)}</div>
      </div>
    </div>
  );
};
