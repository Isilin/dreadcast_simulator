import { createRepositoryErrorClass } from '@/utils/repository-error';

export const ACCOUNT_REPOSITORY_ERROR_CODE = {
  MISSING_AUTH_SESSION: 'MISSING_AUTH_SESSION',
  FETCH_PROFILE_FAILED: 'FETCH_PROFILE_FAILED',
  CREATE_PSEUDO_FAILED: 'CREATE_PSEUDO_FAILED',
  INVALID_PROFILE_PAYLOAD: 'INVALID_PROFILE_PAYLOAD',
} as const;

export const AccountRepositoryError = createRepositoryErrorClass(
  'AccountRepositoryError',
);
