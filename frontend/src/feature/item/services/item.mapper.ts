import type { ItemResponseDto } from './item.dto';

import type { Item } from '@/feature/item';

export const toDomain = (dto: ItemResponseDto): Item => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  tech: dto.tech,
  integrity: dto.integrity,
  type: dto.type,
  prerequisites: dto.prerequisites,
  effects: dto.effects,
  minDamage: dto.minDamage,
  maxDamage: dto.maxDamage,
  hands: dto.hands,
  reach: dto.reach,
  hitsPerRound: dto.hitsPerRound,
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
  minDamage: item.minDamage,
  maxDamage: item.maxDamage,
  hands: item.hands,
  reach: item.reach,
  hitsPerRound: item.hitsPerRound,
});
