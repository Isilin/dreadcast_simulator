import type { ImplantResponseDto } from './implant.dto';

import type { Implant } from '@/domain/implant';

export const toDomain = (dto: ImplantResponseDto): Implant => ({
  name: dto.name,
  levelMax: dto.valuePerLevel.length,
  attributes: dto.attributes,
  valuePerLevel: dto.valuePerLevel,
});

export const toDTO = (implant: Implant): ImplantResponseDto => ({
  name: implant.name,
  attributes: implant.attributes,
  valuePerLevel: implant.valuePerLevel,
});
