import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import type { Implant } from '@/feature/implant';
import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

export type WorkbenchDragData =
  | { kind: 'item'; item: Item }
  | { kind: 'kit'; kit: Kit; source: 'catalogue' | 'installed' }
  | { kind: 'implant'; implant: Implant; source: 'catalogue' | 'installed' }
  | { kind: 'drug'; drug: Drug; source: 'catalogue' | 'installed' };

export interface WorkbenchDropData {
  kind: 'item-slot' | 'kit-rack' | 'removal-dock';
  spot: ItemSpot;
}

export type FixedWorkbenchDropData =
  | { kind: 'implant-bay' }
  | { kind: 'drug-slot' };

export type WorkbenchDropTarget =
  | WorkbenchDropData
  | FixedWorkbenchDropData;
