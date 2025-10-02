import type { StatModifier } from '@/domain/stats';
import type { ItemSpot } from '@/domain/suit';

export const ItemTypeValues = [
  'head',
  'chest',
  'legs',
  'feet',
  'secondary',
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee',
] as const;
export type ItemType = (typeof ItemTypeValues)[number];

export interface Item {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
  type: ItemType;
  prerequisites?: StatModifier[];
  effects?: StatModifier[];
  minDamage?: number;
  maxDamage?: number;
  hands?: number;
  reach?: number;
  hitsPerRound?: number;
}

export type ItemsState = Record<ItemSpot, Item | null>;
