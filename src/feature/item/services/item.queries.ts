import { useQuery } from '@tanstack/react-query';

import { fetchItemById, fetchItems } from './item.repo';
import type { ItemType } from '../model/item.types';

const ITEMS_STALE_TIME_MS = 5 * 60 * 1000;
const ITEMS_GC_TIME_MS = 30 * 60 * 1000;

export const itemQueryKeys = {
  all: ['items'] as const,
  list: (type?: ItemType[]) => ['items', { type: type ?? [] }] as const,
  detail: (id?: string | null) => ['item', id ?? null] as const,
};

export const useItems = (type?: ItemType[]) =>
  useQuery({
    queryKey: itemQueryKeys.list(type),
    queryFn: ({ signal }) => fetchItems(type, signal),
    staleTime: ITEMS_STALE_TIME_MS,
    gcTime: ITEMS_GC_TIME_MS,
  });

export const useItem = (id?: string | null) =>
  useQuery({
    queryKey: itemQueryKeys.detail(id),
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error('Item ID manquant');
      }
      return fetchItemById(id, signal);
    },
    enabled: Boolean(id),
    staleTime: ITEMS_STALE_TIME_MS,
    gcTime: ITEMS_GC_TIME_MS,
  });
