import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

/** Elements dragged from the catalogue onto the workbench. */
export type WorkbenchDragData =
  | { kind: 'item'; item: Item }
  | { kind: 'kit'; kit: Kit }
  | { kind: 'drug'; drug: Drug };

export interface WorkbenchDropData {
  kind: 'item-slot' | 'kit-rack';
  spot: ItemSpot;
}

export interface FixedWorkbenchDropData {
  kind: 'drug-slot';
}

export type WorkbenchDropTarget = WorkbenchDropData | FixedWorkbenchDropData;
