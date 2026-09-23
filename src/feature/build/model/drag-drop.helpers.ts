import type {
  WorkbenchDragData,
  WorkbenchDropTarget,
} from './drag-drop.types';
import { workbenchSlotLabels } from './workbench.types';

import { type ItemSpot, ItemSpotValue } from '@/domain';
import type { Drug } from '@/feature/drug';
import { ImplantNameValues, type Implant } from '@/feature/implant';
import { itemMatchsSpot, ItemTypeValues, type Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

export const isItemSpot = (value: unknown): value is ItemSpot =>
  typeof value === 'string' && ItemSpotValue.includes(value as ItemSpot);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const hasTextFields = (
  value: unknown,
  fields: string[],
): value is Record<string, unknown> =>
  isRecord(value) && fields.every((field) => typeof value[field] === 'string');

const isDragSource = (value: unknown): value is 'catalogue' | 'installed' =>
  value === 'catalogue' || value === 'installed';

const isItemType = (value: unknown): value is Item['type'] =>
  typeof value === 'string' &&
  ItemTypeValues.includes(value as Item['type']);

const isItemData = (value: unknown): value is Item =>
  hasTextFields(value, ['id', 'name', 'image']) &&
  isRecord(value) &&
  typeof value.tech === 'number' &&
  typeof value.integrity === 'number' &&
  isItemType(value.type);

const isKitData = (value: unknown): value is Kit =>
  hasTextFields(value, ['id', 'name', 'type']) &&
  isRecord(value) &&
  typeof value.tech === 'number' &&
  isItemType(value.type) &&
  Array.isArray(value.effects);

const isImplantData = (value: unknown): value is Implant =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  ImplantNameValues.includes(value.name as Implant['name']) &&
  typeof value.levelMax === 'number' &&
  Array.isArray(value.attributes) &&
  Array.isArray(value.valuePerLevel);

const isDrugData = (value: unknown): value is Drug =>
  hasTextFields(value, ['id', 'name', 'image']) &&
  isRecord(value) &&
  Array.isArray(value.sideEffects);

export const getDraggedData = (data: unknown): WorkbenchDragData | null => {
  if (!isRecord(data)) return null;

  if (data.kind === 'item' && isItemData(data.item)) {
    return { kind: 'item', item: data.item };
  }
  if (
    data.kind === 'kit' &&
    isDragSource(data.source) &&
    isKitData(data.kit)
  ) {
    return {
      kind: 'kit',
      kit: data.kit,
      source: data.source,
    };
  }
  if (
    data.kind === 'implant' &&
    isDragSource(data.source) &&
    isImplantData(data.implant)
  ) {
    return {
      kind: 'implant',
      implant: data.implant,
      source: data.source,
    };
  }
  if (
    data.kind === 'drug' &&
    isDragSource(data.source) &&
    isDrugData(data.drug)
  ) {
    return {
      kind: 'drug',
      drug: data.drug,
      source: data.source,
    };
  }

  return null;
};

export const getDropData = (data: unknown): WorkbenchDropTarget | null => {
  if (!isRecord(data)) return null;

  if (data.kind === 'implant-bay' || data.kind === 'drug-slot') {
    return { kind: data.kind };
  }
  if (
    (data.kind === 'item-slot' ||
      data.kind === 'kit-rack' ||
      data.kind === 'removal-dock') &&
    isItemSpot(data.spot)
  ) {
    return { kind: data.kind, spot: data.spot };
  }

  return null;
};

export const getDragLabel = (dragData: WorkbenchDragData): string => {
  if (dragData.kind === 'item') return dragData.item.name;
  if (dragData.kind === 'kit') return dragData.kit.name;
  if (dragData.kind === 'implant') return dragData.implant.name;
  return dragData.drug.name;
};

export const getDragIdentifier = (dragData: WorkbenchDragData): string => {
  if (dragData.kind === 'item') return dragData.item.id;
  if (dragData.kind === 'kit') return `${dragData.source}-${dragData.kit.id}`;
  if (dragData.kind === 'implant') {
    return `${dragData.source}-${dragData.implant.id}`;
  }
  return `${dragData.source}-${dragData.drug.id}`;
};

export const getDropAnnouncement = (
  dragData: WorkbenchDragData,
  dropData: WorkbenchDropTarget,
): string => {
  if (
    dragData.kind === 'item' &&
    dropData.kind === 'item-slot' &&
    itemMatchsSpot(dragData.item.type, dropData.spot)
  ) {
    return `Déposer ${dragData.item.name} sur ${workbenchSlotLabels[dropData.spot]}.`;
  }

  if (dragData.kind === 'kit' && dropData.kind === 'kit-rack') {
    return `Déposer ${dragData.kit.name} sur ${workbenchSlotLabels[dropData.spot]}.`;
  }

  if (dragData.kind === 'implant' && dropData.kind === 'implant-bay') {
    return `Installer ${dragData.implant.name}.`;
  }

  if (dragData.kind === 'drug' && dropData.kind === 'drug-slot') {
    return `Activer ${dragData.drug.name}.`;
  }

  if (
    dropData.kind === 'removal-dock' &&
    dragData.kind !== 'item' &&
    dragData.source === 'installed'
  ) {
    return `Retirer ${getDragLabel(dragData)} du build.`;
  }

  return 'Cette zone n’accepte pas cet élément.';
};
