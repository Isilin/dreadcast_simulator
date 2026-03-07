import type { ItemSpot, StatModifier } from '@/domain';
import type { ItemType } from '@/feature/item';

export interface Kit {
  id: string;
  name: string;
  tech: number;
  type: ItemType;
  effects: StatModifier[];
}

export interface KitSelection {
  kit: Kit;
  number: number;
}

export type KitsState = Record<ItemSpot, KitSelection[]>;
