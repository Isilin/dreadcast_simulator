import type { StatModifierResponseDto } from './stats.types';

export interface DrugResponseDto {
  id: string;
  name: string;
  image: string;
  stat_modifier: StatModifierResponseDto[];
}
