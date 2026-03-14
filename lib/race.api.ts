import type { RaceResponseDto } from './race.types.ts';

export const RACE_SELECT_QUERY = `
  type,
  strength,
  agility,
  robustness,
  perception,
  stealth,
  computing,
  medicine,
  engineering,
  health,
  stamina
`;

export const typeRace = (race: unknown): RaceResponseDto | null => {
  return (race as RaceResponseDto) || null;
};
