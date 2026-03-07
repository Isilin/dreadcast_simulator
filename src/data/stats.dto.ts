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
