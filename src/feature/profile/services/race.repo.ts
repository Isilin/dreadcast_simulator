import { RACE_REPOSITORY_ERROR_CODE, RaceRepositoryError } from './race.errors';
import { toDomain } from './race.mapper';
import type { Race } from '../model';

export const fetchRaces = async (signal?: AbortSignal): Promise<Race[]> => {
  const { callApi } = await import('@/utils/api-client');
  const races = await callApi((client) => client.catalog.races(), {
    signal,
    ErrorClass: RaceRepositoryError,
    failed: {
      code: RACE_REPOSITORY_ERROR_CODE.FETCH_RACES_FAILED,
      message: 'Impossible de recuperer la liste des races.',
    },
    invalid: {
      code: RACE_REPOSITORY_ERROR_CODE.INVALID_RACES_PAYLOAD,
      message: 'Le format des races recues est invalide.',
    },
  });

  return races.map(toDomain);
};
