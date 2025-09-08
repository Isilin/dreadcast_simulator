import type { RaceResponseDto } from './race.dto';

import type { Race } from '@/domain/race';

export const toDomain = (race: RaceResponseDto): Race => ({
  type: race.type,
  strength: race.strength,
  agility: race.agility,
  robustness: race.robustness,
  perception: race.perception,
  stealth: race.stealth,
  computing: race.computing,
  medicine: race.medicine,
  engineering: race.engineering,
  health: race.health,
  stamina: race.stamina,
});

export const toDTO = (race: Race): RaceResponseDto => ({
  type: race.type,
  strength: race.strength,
  agility: race.agility,
  robustness: race.robustness,
  perception: race.perception,
  stealth: race.stealth,
  computing: race.computing,
  medicine: race.medicine,
  engineering: race.engineering,
  health: race.health,
  stamina: race.stamina,
});
