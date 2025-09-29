export const StatValues = [
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
  'health',
  'stamina',
  'speed',
  'race_damage',
  'hit_rating',
  'team_heal',
  'cac_damage',
  'critical_cac_chance',
  'critical_cac_damages',
  'hit_damages',
  'critical_hit_damages',
] as const;
export type Stat = (typeof StatValues)[number];

export const ImplantNameValues = [
  'Génie',
  'Réplicateur',
  'Sain et sauf',
  'Chameau',
  'Monsieur Clone',
  'Geek',
  'Chanceux',
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
  'La Main Bleue',
  'Éclaireur',
  'Je te vois',
  'Scientifique',
  'Économe',
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

export type ImplantsState = Record<ImplantName, number>;
