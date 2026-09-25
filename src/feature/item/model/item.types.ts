import type { ItemSpot, StatModifier } from '@/domain';
import type { Prerequisite } from '@/feature/prerequisite';

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

export const WeaponKindValues = ['melee', 'shot'] as const;
export type WeaponKind = (typeof WeaponKindValues)[number];

export const WEAPON_KIND_LABELS: Record<WeaponKind, string> = {
  melee: 'Corps à corps',
  shot: 'Tir',
};

export const WeaponHandsValues = [1, 2] as const;
export type WeaponHands = (typeof WeaponHandsValues)[number];

export const DAMAGE_BONUS_VALUES = [0, 1, 2, 3, 4, 5] as const;
export type DamageBonusType = (typeof DAMAGE_BONUS_VALUES)[number];

export interface Item {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
  type: ItemType;
  prerequisites?: Prerequisite[];
  effects?: StatModifier[];
  minDamage?: number;
  maxDamage?: number;
  minHeal?: number;
  maxHeal?: number;
  damageBonus?: DamageBonusType;
  hands?: number;
  reach?: number;
  hitsPerRound?: number;
}

export type ItemsState = Record<ItemSpot, Item | null>;
