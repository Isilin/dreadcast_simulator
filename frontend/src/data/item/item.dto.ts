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
    | 'integrity'
    | 'speed';
  value: number;
}

export interface ItemResponseDto {
  id: string;
  name: string;
  image: string;
  tech: number;
  integrity: number;
  type: 'head' | 'chest' | 'legs' | 'feet' | 'secondary' | 'weapon';
  prerequisites?: PrerequisiteResponseDto[];
  effects?: EffectResponseDto[];
  minDamage?: number;
  maxDamage?: number;
  hands?: number;
  reach?: number;
  hitsPerRound?: number;
}
