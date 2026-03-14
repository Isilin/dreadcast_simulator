import type { ItemResponseDto } from './item.types.ts';

export const ITEM_SELECT_QUERY = `
  id,
  name,
  image,
  tech,
  integrity,
  type,
  min_damage,
  max_damage,
  damage_bonus,
  hands,
  reach,
  hits_per_round,
  item_prerequisite (
    property,
    value
  ),
  item_effect (
    property,
    value
  )
`;

export const typeItem = (item: unknown): ItemResponseDto | null => {
  return (item as ItemResponseDto) || null;
};
