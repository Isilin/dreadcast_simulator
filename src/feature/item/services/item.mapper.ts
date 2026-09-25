import type { ItemResponseDto } from './item.schema';
import type { Item } from '../model/item.types';

import { toPrerequisites } from '@/feature/prerequisite';

export const toDomain = (dto: ItemResponseDto): Item => {
  const prerequisites = toPrerequisites({
    stats: dto.item_prerequisite,
    titles: dto.item_prerequisite_title,
    implants: dto.item_prerequisite_implant,
  });

  return {
    id: dto.id,
    name: dto.name,
    image: dto.image,
    tech: dto.tech,
    integrity: dto.integrity,
    type: dto.type,
    prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
    effects: dto.item_effect.length > 0 ? dto.item_effect : undefined,
    minDamage: dto.min_damage ?? undefined,
    maxDamage: dto.max_damage ?? undefined,
    minHeal: dto.min_heal ?? undefined,
    maxHeal: dto.max_heal ?? undefined,
    damageBonus: (dto.damage_bonus ?? undefined) as Item['damageBonus'],
    hands: dto.hands ?? undefined,
    reach: dto.reach ?? undefined,
    hitsPerRound: dto.hits_per_round ?? undefined,
  };
};
