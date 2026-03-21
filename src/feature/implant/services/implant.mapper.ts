import type { ImplantResponseDto } from './implant.schema';
import type { Implant } from '../model/implant.types';

export const toDomain = (dto: ImplantResponseDto): Implant => ({
  id: dto.id,
  name: dto.name,
  levelMax: dto.level_max,
  attributes: dto.implant_attribute.map((item) => item.attribute),
  valuePerLevel: Array.from({ length: dto.level_max }, (_, index) => {
    const level = index + 1;
    const valueForLevel = dto.implant_value.find(
      (item) => item.level === level,
    );
    return valueForLevel?.value ?? 0;
  }),
});
