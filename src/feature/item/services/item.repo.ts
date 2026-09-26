import { ITEM_REPOSITORY_ERROR_CODE, ItemRepositoryError } from './item.errors';
import { toDomain } from './item.mapper';
import type { Item } from '../model/item.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchItems = async (signal?: AbortSignal): Promise<Item[]> => {
  const response = await GET('/api/items', signal);

  if (!response.ok) {
    throw new ItemRepositoryError({
      code: ITEM_REPOSITORY_ERROR_CODE.FETCH_ITEMS_FAILED,
      message: 'Impossible de recuperer la liste des items.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const { itemArrayResponseSchema } = await import('./item.schema');
  const items = validatePayload({
    schema: itemArrayResponseSchema,
    payload,
    errorCode: ITEM_REPOSITORY_ERROR_CODE.INVALID_ITEMS_PAYLOAD,
    errorMessage: 'Le format des items recus est invalide.',
  });

  return items.map(toDomain);
};
