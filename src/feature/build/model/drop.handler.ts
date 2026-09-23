import type {
  WorkbenchDragData,
  WorkbenchDropTarget,
} from './drag-drop.types';
import { workbenchSlotLabels } from './workbench.types';

import type { ItemSpot } from '@/domain';
import {
  computeImplantsCount,
  MAX_IMPLANTS,
  type Implant,
  type ImplantsState,
} from '@/feature/implant';
import { itemMatchsSpot } from '@/feature/item';
import type { Item } from '@/feature/item';
import type { Kit, KitSelection } from '@/feature/kit';

export interface DropHandlerActions {
  setItem: (spot: ItemSpot, item: Item) => void;
  addKit: (spot: ItemSpot, kit: Kit) => void;
  deleteKit: (spot: ItemSpot, index: number) => void;
  setKitNumber: (spot: ItemSpot, index: number, number: number) => void;
  decreaseImplant: (name: Implant['name']) => void;
  setImplant: (name: Implant['name'], level: number) => void;
  setDrug: (id: string | null) => void;
}

export interface DropHandlerArgs extends DropHandlerActions {
  dragData: WorkbenchDragData | null;
  dropData: WorkbenchDropTarget | null;
  activeItem: Item | null;
  kits: KitSelection[];
  implants: ImplantsState;
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
  implants,
  setItem,
  addKit,
  deleteKit,
  setKitNumber,
  decreaseImplant,
  setImplant,
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

  if (dragData.kind === 'implant' && dropData.kind === 'implant-bay') {
    if (computeImplantsCount(implants) >= MAX_IMPLANTS) {
      return { message: `Limite de ${MAX_IMPLANTS} implants atteinte.` };
    }
    const level = Math.min(
      (implants[dragData.implant.name] ?? 0) + 1,
      dragData.implant.levelMax,
    );
    setImplant(dragData.implant.name, level);
    return { message: `${dragData.implant.name} installé niveau ${level}.` };
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
    dragData.kind === 'implant' &&
    dragData.source === 'installed'
  ) {
    decreaseImplant(dragData.implant.name);
    return { message: `${dragData.implant.name} retiré.` };
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
