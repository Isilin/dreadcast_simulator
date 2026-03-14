import type { Kit } from '../model';
import type { KitResponseDto } from './kit.schema';

export const toDomain = (dto: KitResponseDto): Kit => ({
  id: dto.id,
  name: dto.name,
  tech: dto.tech,
  type: dto.type,
  effects: dto.kit_effect,
});
