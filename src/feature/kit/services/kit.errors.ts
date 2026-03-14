import { createRepositoryErrorClass } from '@/utils/repository-error';

export const KIT_REPOSITORY_ERROR_CODE = {
  FETCH_KITS_FAILED: 'FETCH_KITS_FAILED',
  FETCH_KIT_FAILED: 'FETCH_KIT_FAILED',
  INVALID_KITS_PAYLOAD: 'INVALID_KITS_PAYLOAD',
  INVALID_KIT_PAYLOAD: 'INVALID_KIT_PAYLOAD',
} as const;

export type KitRepositoryErrorCode =
  (typeof KIT_REPOSITORY_ERROR_CODE)[keyof typeof KIT_REPOSITORY_ERROR_CODE];

export const KitRepositoryError =
  createRepositoryErrorClass('KitRepositoryError');
