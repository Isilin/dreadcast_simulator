export interface StatModifierResponseDto {
  property:
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
  value: number;
}

export interface DrugResponseDto {
  id: string;
  name: string;
  image: string;
  stat_modifier: StatModifierResponseDto[];
}
