import type { Kit as KitDto } from '@server/feature/catalog/catalog.schema';

import type { Kit } from '../model';

import { toPrerequisites } from '@/feature/prerequisite';

export const toDomain = (dto: KitDto): Kit => {
  const prerequisites = toPrerequisites({
    stats: dto.kit_prerequisite,
    titles: dto.kit_prerequisite_title,
    implants: dto.kit_prerequisite_implant,
    races: dto.kit_prerequisite_race,
  });

  return {
    id: dto.id,
    name: dto.name,
    tech: dto.tech,
    type: dto.type,
    effects: [...dto.kit_effect],
    prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
  };
};
