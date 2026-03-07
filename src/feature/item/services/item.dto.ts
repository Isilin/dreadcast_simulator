import type { StatModifierResponseDto } from '@/data/stats.dto';

export interface ItemResponseDto {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
  type:
    | 'head'
    | 'chest'
    | 'legs'
    | 'feet'
    | 'secondary'
    | '1handShot'
    | '2handsShot'
    | '1handMelee'
    | '2handsMelee';
  prerequisites?: StatModifierResponseDto[];
  effects?: StatModifierResponseDto[];
  minDamage?: number;
  maxDamage?: number;
  hands?: number;
  reach?: number;
  hitsPerRound?: number;
}
