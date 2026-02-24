import type { ItemSpot, StatModifier } from '@/domain';

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

export const DAMAGE_BONUS_VALUES = [0, 1, 2, 3, 4, 5] as const;
export type DamageBonusType = (typeof DAMAGE_BONUS_VALUES)[number];

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
  damageBonus?: DamageBonusType;
  hands?: number;
  reach?: number;
  hitsPerRound?: number;
}

export type ItemsState = Record<ItemSpot, Item | null>;
