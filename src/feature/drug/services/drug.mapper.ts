import type { Drug } from '../model/drug.types';

import type { DrugResponseDto } from '@/lib/drug.types';

export const toDomain = (dto: DrugResponseDto): Drug => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  sideEffects: dto.stat_modifier,
});
