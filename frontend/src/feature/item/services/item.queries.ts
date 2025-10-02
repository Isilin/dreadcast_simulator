import { useQuery } from '@tanstack/react-query';

import { fetchItems } from './item.repo';

import type { ItemType } from '@/feature/item';

export const useItems = (type?: ItemType[]) =>
  useQuery({
    queryKey: ['items', type],
    queryFn: () => fetchItems(type),
  });
