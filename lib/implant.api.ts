export const IMPLANT_SELECT_QUERY = `
  id,
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
