import { createRepositoryErrorClass } from '@/utils/repository-error';

export const KIT_REPOSITORY_ERROR_CODE = {
  FETCH_KITS_FAILED: 'FETCH_KITS_FAILED',
  INVALID_KITS_PAYLOAD: 'INVALID_KITS_PAYLOAD',
} as const;

export const KitRepositoryError =
  createRepositoryErrorClass('KitRepositoryError');
