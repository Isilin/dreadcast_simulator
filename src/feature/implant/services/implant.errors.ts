import { createRepositoryErrorClass } from '@/utils/repository-error';

export const IMPLANT_REPOSITORY_ERROR_CODE = {
  FETCH_IMPLANTS_FAILED: 'FETCH_IMPLANTS_FAILED',
  FETCH_IMPLANT_FAILED: 'FETCH_IMPLANT_FAILED',
  INVALID_IMPLANTS_PAYLOAD: 'INVALID_IMPLANTS_PAYLOAD',
  INVALID_IMPLANT_PAYLOAD: 'INVALID_IMPLANT_PAYLOAD',
} as const;

export type ImplantRepositoryErrorCode =
  (typeof IMPLANT_REPOSITORY_ERROR_CODE)[keyof typeof IMPLANT_REPOSITORY_ERROR_CODE];

export const ImplantRepositoryError = createRepositoryErrorClass(
  'ImplantRepositoryError',
);
