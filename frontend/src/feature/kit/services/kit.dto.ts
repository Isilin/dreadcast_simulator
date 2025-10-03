import type { StatModifierResponseDto } from '@/data/stats.dto';

export interface KitResponseDto {
  id: string;
  name: string;
  tech: number;
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
  effects: StatModifierResponseDto[];
}
