import type { Effect, ItemType } from './item';

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

export const toKitType = (type: ItemType): KitType | KitType[] => {
  if (type === 'weapon') {
    return ['1handMelee', '1handShot', '2handsMelee', '2handsShot'];
  } else return type as KitType;
};
