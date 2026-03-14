import type { ImplantResponseDto } from './implant.types.ts';

export const IMPLANT_SELECT_QUERY = `
  name,
  level_max,
  implant_attribute (
    attribute
  ),
  implant_value (
    level,
    value
  )
`;

export const typeImplant = (implant: unknown): ImplantResponseDto | null => {
  return (implant as ImplantResponseDto) || null;
};
