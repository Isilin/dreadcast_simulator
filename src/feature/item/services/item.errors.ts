import { createRepositoryErrorClass } from '@/utils/repository-error';

export const ITEM_REPOSITORY_ERROR_CODE = {
  FETCH_ITEMS_FAILED: 'FETCH_ITEMS_FAILED',
  INVALID_ITEMS_PAYLOAD: 'INVALID_ITEMS_PAYLOAD',
} as const;

export const ItemRepositoryError = createRepositoryErrorClass(
  'ItemRepositoryError',
);
