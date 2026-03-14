import type { Race } from '../model';
import { RACE_REPOSITORY_ERROR_CODE, RaceRepositoryError } from './race.errors';
import { toDomain } from './race.mapper';
import { raceArrayResponseSchema, raceResponseDtoSchema } from './race.schema';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchRaces = async (signal?: AbortSignal): Promise<Race[]> => {
  const response = await GET('/api/races', signal);

  if (!response.ok) {
    throw new RaceRepositoryError({
      code: RACE_REPOSITORY_ERROR_CODE.FETCH_RACES_FAILED,
      message: 'Impossible de recuperer la liste des races.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const races = validatePayload({
    schema: raceArrayResponseSchema,
    payload,
    errorCode: RACE_REPOSITORY_ERROR_CODE.INVALID_RACES_PAYLOAD,
    errorMessage: 'Le format des races recues est invalide.',
  });

  return races.map(toDomain);
};

export const fetchRaceByType = async (
  type: string,
  signal?: AbortSignal,
): Promise<Race> => {
  const response = await GET(`/api/races/${encodeURIComponent(type)}`, signal);

  if (!response.ok) {
    throw new RaceRepositoryError({
      code: RACE_REPOSITORY_ERROR_CODE.FETCH_RACE_FAILED,
      message: `Impossible de recuperer la race ${type}.`,
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const race = validatePayload({
    schema: raceResponseDtoSchema,
    payload,
    errorCode: RACE_REPOSITORY_ERROR_CODE.INVALID_RACE_PAYLOAD,
    errorMessage: `Le format de la race ${type} est invalide.`,
  });

  return toDomain(race);
};
