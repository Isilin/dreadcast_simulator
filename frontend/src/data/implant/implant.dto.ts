import type { Stat } from '@/domain/skill';

export interface ImplantResponseDto {
  name:
    | 'Génie'
    | 'Réplicateur'
    | 'Sain et sauf'
    | 'Chameau'
    | 'Monsieur Clone'
    | 'Geek'
    | 'Chanceux'
    | 'Raciste'
    | 'Urgentiste'
    | 'Prestidigitateur'
    | 'Flash Gordon'
    | 'Inépuisable'
    | "Peau d'argent"
    | 'Ingénieur'
    | 'Brute'
    | 'Rôdeur'
    | "Peau d'acier"
    | 'La Main Bleue'
    | 'Éclaireur'
    | 'Je te vois'
    | 'Scientifique'
    | 'Économe'
    | 'Félin'
    | 'Aide de camp'
    | 'Commando'
    | 'Ninja'
    | 'Polyvalent'
    | "Tireur d'élite"
    | 'Oeil de lynx'
    | 'Enragé';
  attributes: Stat[];
  valuePerLevel: number[];
}
