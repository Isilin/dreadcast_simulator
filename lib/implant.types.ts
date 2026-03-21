export interface ImplantAttributeResponseDto {
  attribute:
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
}

export interface ImplantValueResponseDto {
  level: number;
  value: number;
}

export interface ImplantResponseDto {
  id: number;
  name: string;
  level_max: number;
  implant_attribute: ImplantAttributeResponseDto[];
  implant_value: ImplantValueResponseDto[];
}
