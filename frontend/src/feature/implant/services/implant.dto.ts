type StatDto =
  | 'strength'
  | 'agility'
  | 'robustness'
  | 'perception'
  | 'stealth'
  | 'computing'
  | 'medicine'
  | 'engineering'
  | 'health'
  | 'stamina'
  | 'integrity'
  | 'speed'
  | 'raceDamage'
  | 'hitRating'
  | 'teamHeal'
  | 'cacDamage'
  | 'criticalCacChance'
  | 'criticalCacDamage'
  | 'hitDamages'
  | 'criticalHitDamage';

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
  attributes: StatDto[];
  valuePerLevel: number[];
}
