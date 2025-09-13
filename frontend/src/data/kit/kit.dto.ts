import type { EffectResponseDto } from '../item/item.dto';

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
    | 'left_arm'
    | 'right_arm';
  effects: EffectResponseDto[];
}
