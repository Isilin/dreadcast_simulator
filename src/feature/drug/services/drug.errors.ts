import { createRepositoryErrorClass } from '@/utils/repository-error';

export const DRUG_REPOSITORY_ERROR_CODE = {
  FETCH_DRUGS_FAILED: 'FETCH_DRUGS_FAILED',
  FETCH_DRUG_FAILED: 'FETCH_DRUG_FAILED',
  INVALID_DRUGS_PAYLOAD: 'INVALID_DRUGS_PAYLOAD',
  INVALID_DRUG_PAYLOAD: 'INVALID_DRUG_PAYLOAD',
} as const;

export const DrugRepositoryError = createRepositoryErrorClass(
  'DrugRepositoryError',
);
