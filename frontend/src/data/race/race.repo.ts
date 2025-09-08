import { fetchRacesMock } from './race.repo.mock';

import type { Race } from '@/domain/race';
import { USE_MOCK } from '@/utils/use-mock';

export async function fetchRaces(): Promise<Race[]> {
  if (USE_MOCK) {
    return fetchRacesMock();
  }

  // Version “réelle” (plus tard)
  // const json = await api.get('races').json();
  // const validated = raceArraySchema.parse(json);
  // return validated.map(toDomain);

  // Pour l’instant, on renvoie le mock par défaut

  return fetchRacesMock();
}
