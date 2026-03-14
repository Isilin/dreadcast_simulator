export type KitStatProperty =
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

export interface KitEffectResponseDto {
  property: KitStatProperty;
  value: number;
}

export interface KitResponseDto {
  id: string;
  name: string;
  tech: number;
  type:
    | 'head'
    | 'chest'
    | 'legs'
    | 'feet'
    | 'secondary'
    | '1handShot'
    | '2handsShot'
    | '1handMelee'
    | '2handsMelee';
  kit_effect: KitEffectResponseDto[];
}
