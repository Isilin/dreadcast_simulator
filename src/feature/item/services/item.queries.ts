import { useQuery } from '@tanstack/react-query';

import { fetchItems } from './item.repo';

const ITEMS_STALE_TIME_MS = 5 * 60 * 1000;
const ITEMS_GC_TIME_MS = 30 * 60 * 1000;

const itemQueryKeys = {
  all: ['items'] as const,
};

export const useItems = () =>
  useQuery({
    queryKey: itemQueryKeys.all,
    queryFn: ({ signal }) => fetchItems(signal),
    staleTime: ITEMS_STALE_TIME_MS,
    gcTime: ITEMS_GC_TIME_MS,
  });
