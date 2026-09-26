import { createRepositoryErrorClass } from '@/utils/repository-error';

export const TITLE_REPOSITORY_ERROR_CODE = {
  FETCH_TITLES_FAILED: 'FETCH_TITLES_FAILED',
  INVALID_TITLES_PAYLOAD: 'INVALID_TITLES_PAYLOAD',
} as const;

export const TitleRepositoryError = createRepositoryErrorClass(
  'TitleRepositoryError',
);
