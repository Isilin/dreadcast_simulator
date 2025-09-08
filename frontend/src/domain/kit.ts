import type { Effect, ItemType } from './item';

export interface Kit {
  id: string;
  name: string;
  tech: number;
  type: ItemType;
  effects: Effect[];
}
