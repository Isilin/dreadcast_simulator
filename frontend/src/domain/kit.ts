import type { Effect } from './item';

export type KitType =
  | 'head'
  | 'chest'
  | 'legs'
  | 'feet'
  | 'secondary'
  | '1handShot'
  | '2handsShot'
  | '1handMelee'
  | '2handsMelee';

export interface Kit {
  id: string;
  name: string;
  tech: number;
  type: KitType;
  effects: Effect[];
}
