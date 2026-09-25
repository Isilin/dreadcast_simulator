import type { ItemResponseDto } from './item.types.ts';

// The implant of a prerequisite is many-to-one: PostgREST returns an object,
// while supabase-js (without generated DB types) infers an array. Hence the
// `as unknown` casts in the handlers.
export const ITEM_SELECT_QUERY = `
  id,
  name,
  image,
  tech,
  integrity,
  type,
  min_damage,
  max_damage,
  min_heal,
  max_heal,
  damage_bonus,
  hands,
  reach,
  hits_per_round,
  item_prerequisite (
    property,
    value
  ),
  item_prerequisite_title (
    title_id
  ),
  item_prerequisite_implant (
    implant (
      name
    )
  ),
  item_effect (
    property,
    value
  )
`;

export const typeItem = (item: unknown): ItemResponseDto | null => {
  return (item as ItemResponseDto) || null;
};
