import type { Stat } from '@/domain/skill';

export interface ImplantResponseDto {
  name:
    | 'Geek'
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
    | 'Éclaireur'
    | 'Je te vois'
    | 'Scientifique'
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
