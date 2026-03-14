import { createRepositoryErrorClass } from '@/utils/repository-error';

export const ITEM_REPOSITORY_ERROR_CODE = {
  FETCH_ITEMS_FAILED: 'FETCH_ITEMS_FAILED',
  FETCH_ITEM_FAILED: 'FETCH_ITEM_FAILED',
  INVALID_ITEMS_PAYLOAD: 'INVALID_ITEMS_PAYLOAD',
  INVALID_ITEM_PAYLOAD: 'INVALID_ITEM_PAYLOAD',
} as const;

export type ItemRepositoryErrorCode =
  (typeof ITEM_REPOSITORY_ERROR_CODE)[keyof typeof ITEM_REPOSITORY_ERROR_CODE];

export const ItemRepositoryError = createRepositoryErrorClass(
  'ItemRepositoryError',
);
