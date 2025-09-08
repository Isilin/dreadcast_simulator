import { useQuery } from '@tanstack/react-query';

import { fetchKits } from './kit.repo';

import type { Kit } from '@/domain/kit';

export const useKits = (type?: Kit['type']) =>
  useQuery({
    queryKey: ['kits', type],
    queryFn: () => fetchKits(type),
  });
