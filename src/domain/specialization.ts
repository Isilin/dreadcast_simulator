export const SpecializationValues = [
  'medecin',
  'informaticien',
  'ingenieur',
  'combattant_cac',
  'tireur',
  'furtif',
  'tank',
  'soutien',
  'polyvalent',
] as const;
export type Specialization = (typeof SpecializationValues)[number];

export const SPECIALIZATION_LABELS: Record<Specialization, string> = {
  medecin: 'Médecin',
  informaticien: 'Informaticien',
  ingenieur: 'Ingénieur',
  combattant_cac: 'Combattant CaC',
  tireur: 'Tireur',
  furtif: 'Furtif',
  tank: 'Tank',
  soutien: 'Soutien',
  polyvalent: 'Polyvalent',
};
