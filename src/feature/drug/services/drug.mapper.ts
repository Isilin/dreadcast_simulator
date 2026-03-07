import type { DrugResponseDto } from './drug.dto';
import type { Drug } from '../model/drug.types';

export const toDomain = (dto: DrugResponseDto): Drug => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  sideEffects: dto.stat_modifier,
});
