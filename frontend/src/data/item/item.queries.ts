import { useQuery } from '@tanstack/react-query';

import { fetchItems } from './item.repo';

import type { Item } from '@/domain/item';

export const useItems = (type?: Item['type']) =>
  useQuery({
    queryKey: ['items', type],
    queryFn: () => fetchItems(type),
  });
