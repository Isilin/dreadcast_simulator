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
import { type KitsState } from '@/feature/kit';
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
  onDrugActivate: () => void;
  onDrugClear: () => void;
}

const getKitCount = (kits: KitsState, spot: ItemSpot): number =>
  kits[spot].reduce((count, selection) => count + selection.number, 0);

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
  onDrugActivate,
  onDrugClear,
}: WorkbenchBoardProps) => {
  const renderEquipmentSlot = (spot: ItemSpot) => {
    const isOffhand = isTwoHandedOffhand(items, spot);

    return (
      <EquipmentSlot
        key={spot}
        spot={spot}
        spotLabel={workbenchSlotLabels[spot]}
        item={items[spot]}
        kitCount={getKitCount(kitsBySpot, spot)}
        effects={
          isOffhand ? [] : computeSlotEffects(items[spot], kitsBySpot[spot])
        }
        isOffhand={isOffhand}
        isActive={catalogueFilter !== 'drugs' && activeSpot === spot}
        draggedItem={draggedData?.kind === 'item' ? draggedData.item : null}
        onActivate={onActivateSpot}
        onKitOpen={onKitOpen}
        onDamageBonusChange={(bonus) => onDamageBonusChange(spot, bonus)}
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
