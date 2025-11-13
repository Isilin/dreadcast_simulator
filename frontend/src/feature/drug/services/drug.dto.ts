import type { StatModifierResponseDto } from '@/data/stats.dto';

export interface DrugResponseDto {
  id: string;
  name: string;
  image: string;
  sideEffects: StatModifierResponseDto[];
}
