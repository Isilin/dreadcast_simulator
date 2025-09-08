import type { Stat } from './skill';

export const ImplantNameValues = [
  'Geek',
  'Raciste',
  'Urgentiste',
  'Prestidigitateur',
  'Flash Gordon',
  'Inépuisable',
  "Peau d'argent",
  'Ingénieur',
  'Brute',
  'Rôdeur',
  "Peau d'acier",
  'Éclaireur',
  'Je te vois',
  'Scientifique',
  'Félin',
  'Aide de camp',
  'Commando',
  'Ninja',
  'Polyvalent',
  "Tireur d'élite",
  'Oeil de lynx',
  'Enragé',
] as const;
export type ImplantName = (typeof ImplantNameValues)[number];

export interface Implant {
  name: ImplantName;
  levelMax: number;
  attributes: Stat[];
  valuePerLevel: number[];
}
