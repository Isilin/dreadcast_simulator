import type {
  WorkbenchDragData,
  WorkbenchDropTarget,
} from './drag-drop.types';
import { workbenchSlotLabels } from './workbench.types';

import type { ItemSpot } from '@/domain';
import { getEquippedSpot, itemMatchsSpot } from '@/feature/item';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

export interface DropHandlerActions {
  setItem: (spot: ItemSpot, item: Item) => void;
  addKit: (spot: ItemSpot, kit: Kit) => void;
  setDrug: (id: string | null) => void;
}

export interface DropHandlerArgs extends DropHandlerActions {
  dragData: WorkbenchDragData | null;
  dropData: WorkbenchDropTarget | null;
  activeItem: Item | null;
}

export interface DropHandlerResult {
  message: string;
  nextSpot?: ItemSpot;
}

export const handleDrop = ({
  dragData,
  dropData,
  activeItem,
  setItem,
  addKit,
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
      nextSpot: getEquippedSpot(dropData.spot, dragData.item),
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

  return { message: 'Cette zone n’accepte pas cet élément.' };
};
