import { createRepositoryErrorClass } from '@/utils/repository-error';

export const RACE_REPOSITORY_ERROR_CODE = {
  FETCH_RACES_FAILED: 'FETCH_RACES_FAILED',
  INVALID_RACES_PAYLOAD: 'INVALID_RACES_PAYLOAD',
} as const;

export const RaceRepositoryError = createRepositoryErrorClass(
  'RaceRepositoryError',
);
