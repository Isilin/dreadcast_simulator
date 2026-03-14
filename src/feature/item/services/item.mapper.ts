import type { ItemResponseDto } from './item.schema';
import type { Item } from '../model/item.types';

export const toDomain = (dto: ItemResponseDto): Item => ({
  id: dto.id,
  name: dto.name,
  image: dto.image,
  tech: dto.tech,
  integrity: dto.integrity,
  type: dto.type,
  prerequisites:
    dto.item_prerequisite.length > 0 ? dto.item_prerequisite : undefined,
  effects: dto.item_effect.length > 0 ? dto.item_effect : undefined,
  minDamage: dto.min_damage ?? undefined,
  maxDamage: dto.max_damage ?? undefined,
  damageBonus: (dto.damage_bonus ?? undefined) as Item['damageBonus'],
  hands: dto.hands ?? undefined,
  reach: dto.reach ?? undefined,
  hitsPerRound: dto.hits_per_round ?? undefined,
});
