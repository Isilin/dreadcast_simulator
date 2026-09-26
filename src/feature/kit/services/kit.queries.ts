import { useQuery } from '@tanstack/react-query';

import { fetchKits } from './kit.repo';

const KITS_STALE_TIME_MS = 5 * 60 * 1000;
const KITS_GC_TIME_MS = 30 * 60 * 1000;

export const kitQueryKeys = {
  all: ['kits'] as const,
};

export const useKits = () =>
  useQuery({
    queryKey: kitQueryKeys.all,
    queryFn: ({ signal }) => fetchKits(signal),
    staleTime: KITS_STALE_TIME_MS,
    gcTime: KITS_GC_TIME_MS,
  });
