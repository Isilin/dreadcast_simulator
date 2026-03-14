import type { Race } from '../model';
import type { RaceResponseDto } from './race.schema';

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
