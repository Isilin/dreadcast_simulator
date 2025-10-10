import type { Race } from '../model';
import type { RaceResponseDto } from './race.dto';

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
  strength: race.strength ?? 0,
  agility: race.agility ?? 0,
  robustness: race.robustness ?? 0,
  perception: race.perception ?? 0,
  stealth: race.stealth ?? 0,
  computing: race.computing ?? 0,
  medicine: race.medicine ?? 0,
  engineering: race.engineering ?? 0,
  health: race.health ?? 0,
  stamina: race.stamina ?? 0,
});
