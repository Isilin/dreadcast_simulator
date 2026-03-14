import type { KitResponseDto } from './kit.types.ts';

export const KIT_SELECT_QUERY = `
  id,
  name,
  tech,
  type,
  kit_effect (
    property,
    value
  )
`;

export const typeKit = (kit: unknown): KitResponseDto | null => {
  return (kit as KitResponseDto) || null;
};
