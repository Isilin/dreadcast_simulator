import type { Drug as DrugDto } from '@server/feature/catalog/catalog.schema';

import type { Drug } from '../model/drug.types';

export const toDomain = (dto: DrugDto): Drug => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  sideEffects: [...dto.stat_modifier],
});
