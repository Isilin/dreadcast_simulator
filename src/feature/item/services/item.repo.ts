import { ITEM_REPOSITORY_ERROR_CODE, ItemRepositoryError } from './item.errors';
import { toDomain } from './item.mapper';
import { itemArrayResponseSchema, itemResponseDtoSchema } from './item.schema';
import type { Item, ItemType } from '../model/item.types';

import { GET } from '@/utils/http';
import { validatePayload } from '@/utils/validation';

export const fetchItems = async (
  type?: ItemType[],
  signal?: AbortSignal,
): Promise<Item[]> => {
  const params = new URLSearchParams();
  if (type && type.length > 0) {
    params.set('type', type.join(','));
  }

  const url = `/api/items${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await GET(url, signal);

  if (!response.ok) {
    throw new ItemRepositoryError({
      code: ITEM_REPOSITORY_ERROR_CODE.FETCH_ITEMS_FAILED,
      message: 'Impossible de recuperer la liste des items.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const items = validatePayload({
    schema: itemArrayResponseSchema,
    payload,
    errorCode: ITEM_REPOSITORY_ERROR_CODE.INVALID_ITEMS_PAYLOAD,
    errorMessage: 'Le format des items recus est invalide.',
  });

  return items.map(toDomain);
};

export const fetchItemById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Item> => {
  const response = await GET(`/api/items/${encodeURIComponent(id)}`, signal);

  if (!response.ok) {
    throw new ItemRepositoryError({
      code: ITEM_REPOSITORY_ERROR_CODE.FETCH_ITEM_FAILED,
      message: `Impossible de recuperer l'item ${id}.`,
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const item = validatePayload({
    schema: itemResponseDtoSchema,
    payload,
    errorCode: ITEM_REPOSITORY_ERROR_CODE.INVALID_ITEM_PAYLOAD,
    errorMessage: `Le format de l'item ${id} est invalide.`,
  });

  return toDomain(item);
};
