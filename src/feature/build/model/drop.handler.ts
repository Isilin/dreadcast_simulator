import type {
  WorkbenchDragData,
  WorkbenchDropTarget,
} from './drag-drop.types';
import { workbenchSlotLabels } from './workbench.types';

import type { ItemSpot } from '@/domain';
import { itemMatchsSpot } from '@/feature/item';
import type { Item } from '@/feature/item';
import type { Kit, KitSelection } from '@/feature/kit';

export interface DropHandlerActions {
  setItem: (spot: ItemSpot, item: Item) => void;
  addKit: (spot: ItemSpot, kit: Kit) => void;
  deleteKit: (spot: ItemSpot, index: number) => void;
  setKitNumber: (spot: ItemSpot, index: number, number: number) => void;
  setDrug: (id: string | null) => void;
}

export interface DropHandlerArgs extends DropHandlerActions {
  dragData: WorkbenchDragData | null;
  dropData: WorkbenchDropTarget | null;
  activeItem: Item | null;
  kits: KitSelection[];
}

export interface DropHandlerResult {
  message: string;
  nextSpot?: ItemSpot;
}

export const handleDrop = ({
  dragData,
  dropData,
  activeItem,
  kits,
  setItem,
  addKit,
  deleteKit,
  setKitNumber,
  setDrug,
}: DropHandlerArgs): DropHandlerResult => {
  if (!dragData || !dropData) {
    return { message: 'Élément non déplacé.' };
  }

  if (
    dragData.kind === 'item' &&
    dropData.kind === 'item-slot' &&
    itemMatchsSpot(dragData.item.type, dropData.spot)
  ) {
    setItem(dropData.spot, dragData.item);
    return {
      message: `${dragData.item.name} équipé sur ${workbenchSlotLabels[dropData.spot]}.`,
      nextSpot: dropData.spot,
    };
  }

  if (
    dragData.kind === 'kit' &&
    dropData.kind === 'kit-rack' &&
    activeItem?.type === dragData.kit.type
  ) {
    addKit(dropData.spot, dragData.kit);
    return {
      message: `${dragData.kit.name} ajouté à ${workbenchSlotLabels[dropData.spot]}.`,
      nextSpot: dropData.spot,
    };
  }

  if (dragData.kind === 'drug' && dropData.kind === 'drug-slot') {
    setDrug(dragData.drug.id);
    return { message: `${dragData.drug.name} activée.` };
  }

  if (
    dropData.kind === 'removal-dock' &&
    dragData.kind === 'kit' &&
    dragData.source === 'installed'
  ) {
    const index = kits.findIndex(({ kit }) => kit.id === dragData.kit.id);
    const kit = kits[index];
    if (!kit) return { message: 'Kit non trouvé dans cet emplacement.' };
    if (kit.number > 1) {
      setKitNumber(dropData.spot, index, kit.number - 1);
    } else {
      deleteKit(dropData.spot, index);
    }
    return {
      message: `${dragData.kit.name} retiré de ${workbenchSlotLabels[dropData.spot]}.`,
    };
  }

  if (
    dropData.kind === 'removal-dock' &&
    dragData.kind === 'drug' &&
    dragData.source === 'installed'
  ) {
    setDrug(null);
    return { message: `${dragData.drug.name} désactivée.` };
  }

  return { message: 'Cette zone n’accepte pas cet élément.' };
};
