import type { Kit } from '../model';
import type { KitResponseDto } from './kit.dto';

export const toDomain = (dto: KitResponseDto): Kit => ({
  id: dto.id,
  name: dto.name,
  tech: dto.tech,
  type: dto.type,
  effects: dto.effects,
});

export const toDTO = (kit: Kit): KitResponseDto => ({
  id: kit.id,
  name: kit.name,
  tech: kit.tech,
  type: kit.type,
  effects: kit.effects,
});
