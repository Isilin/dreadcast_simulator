import { useQuery } from '@tanstack/react-query';

import { fetchItems } from './item.repo';
import type { ItemType } from '../model/item.types';

export const useItems = (type?: ItemType[]) =>
  useQuery({
    queryKey: ['items', type],
    queryFn: () => fetchItems(type),
  });
