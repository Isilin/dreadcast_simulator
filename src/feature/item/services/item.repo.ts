import { ITEM_REPOSITORY_ERROR_CODE, ItemRepositoryError } from './item.errors';
import { toDomain } from './item.mapper';
import type { Item } from '../model/item.types';

export const fetchItems = async (signal?: AbortSignal): Promise<Item[]> => {
  const { callApi } = await import('@/utils/api-client');
  const items = await callApi((client) => client.catalog.items(), {
    signal,
    ErrorClass: ItemRepositoryError,
    failed: {
      code: ITEM_REPOSITORY_ERROR_CODE.FETCH_ITEMS_FAILED,
      message: 'Impossible de recuperer la liste des items.',
    },
    invalid: {
      code: ITEM_REPOSITORY_ERROR_CODE.INVALID_ITEMS_PAYLOAD,
      message: 'Le format des items recus est invalide.',
    },
  });

  return items.map(toDomain);
};
