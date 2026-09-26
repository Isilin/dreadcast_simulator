import { createRepositoryErrorClass } from '@/utils/repository-error';

export const IMPLANT_REPOSITORY_ERROR_CODE = {
  FETCH_IMPLANTS_FAILED: 'FETCH_IMPLANTS_FAILED',
  INVALID_IMPLANTS_PAYLOAD: 'INVALID_IMPLANTS_PAYLOAD',
} as const;

export const ImplantRepositoryError = createRepositoryErrorClass(
  'ImplantRepositoryError',
);
