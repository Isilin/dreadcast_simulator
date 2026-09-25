export type StatProperty =
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

export interface ItemStatModifierResponseDto {
  property: StatProperty;
  value: number;
}

export interface TitlePrerequisiteResponseDto {
  title_id: string;
}

export interface ImplantPrerequisiteResponseDto {
  implant: { name: string } | null;
}

export interface RacePrerequisiteResponseDto {
  race: string;
}

export interface ItemResponseDto {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
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
  min_damage: number | null;
  max_damage: number | null;
  min_heal: number | null;
  max_heal: number | null;
  damage_bonus: number | null;
  hands: number | null;
  reach: number | null;
  hits_per_round: number | null;
  item_prerequisite: ItemStatModifierResponseDto[];
  item_prerequisite_title: TitlePrerequisiteResponseDto[];
  item_prerequisite_implant: ImplantPrerequisiteResponseDto[];
  item_prerequisite_race: RacePrerequisiteResponseDto[];
  item_effect: ItemStatModifierResponseDto[];
}
