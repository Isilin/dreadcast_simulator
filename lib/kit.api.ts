// The implant of a prerequisite is many-to-one: PostgREST returns an object,
// while supabase-js (without generated DB types) infers an array. Hence the
// `as unknown` casts in the handlers.
export const KIT_SELECT_QUERY = `
  id,
  name,
  tech,
  type,
  kit_effect (
    property,
    value
  ),
  kit_prerequisite (
    property,
    value
  ),
  kit_prerequisite_title (
    title_id
  ),
  kit_prerequisite_implant (
    implant (
      name
    )
  ),
  kit_prerequisite_race (
    race
  )
`;
