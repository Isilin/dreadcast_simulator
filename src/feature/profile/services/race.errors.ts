import { createRepositoryErrorClass } from '@/utils/repository-error';

export const RACE_REPOSITORY_ERROR_CODE = {
  FETCH_RACES_FAILED: 'FETCH_RACES_FAILED',
  FETCH_RACE_FAILED: 'FETCH_RACE_FAILED',
  INVALID_RACES_PAYLOAD: 'INVALID_RACES_PAYLOAD',
  INVALID_RACE_PAYLOAD: 'INVALID_RACE_PAYLOAD',
} as const;

export type RaceRepositoryErrorCode =
  (typeof RACE_REPOSITORY_ERROR_CODE)[keyof typeof RACE_REPOSITORY_ERROR_CODE];

export const RaceRepositoryError = createRepositoryErrorClass(
  'RaceRepositoryError',
);
