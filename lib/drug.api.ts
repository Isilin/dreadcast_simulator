import type { DrugResponseDto } from './drug.types.ts';

export const DRUG_SELECT_QUERY = `
  id,
  name,
  image,
  stat_modifier (
    property,
    value
  )
`;

export const typeDrug = (drug: unknown): DrugResponseDto | null => {
  return (drug as DrugResponseDto) || null;
};
