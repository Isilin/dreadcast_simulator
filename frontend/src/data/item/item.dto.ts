export interface PrerequisiteResponseDto {
  skill:
    | 'strength'
    | 'agility'
    | 'robustness'
    | 'perception'
    | 'stealth'
    | 'computing'
    | 'medicine'
    | 'engineering';
  value: number;
}

export interface EffectResponseDto {
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
    | 'integrity';
  value: number;
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
    | 'left_arm'
    | 'right_arm';
  prerequisites?: PrerequisiteResponseDto[];
  effects?: EffectResponseDto[];
}
