import type { ItemResponseDto } from './item.dto';

import type { Item } from '@/domain/item';

export const toDomain = (dto: ItemResponseDto): Item => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  tech: dto.tech,
  integrity: dto.integrity,
  type: dto.type,
  prerequisites: dto.prerequisites,
  effects: dto.effects,
});

export const toDTO = (item: Item): ItemResponseDto => ({
  id: item.id,
  name: item.name,
  image: item.image,
  tech: item.tech,
  integrity: item.integrity,
  type: item.type,
  prerequisites: item.prerequisites,
  effects: item.effects,
});
