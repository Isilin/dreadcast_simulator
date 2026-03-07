import { useQuery } from '@tanstack/react-query';

import type { ItemType } from '../model/item.types';
import { fetchItems } from './item.repo';

export const useItems = (type?: ItemType[]) =>
  useQuery({
    queryKey: ['items', type],
    queryFn: () => fetchItems(type),
  });
