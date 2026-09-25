import { useQuery } from '@tanstack/react-query';

import { fetchTitles } from './title.repo';

const TITLES_STALE_TIME_MS = 5 * 60 * 1000;
const TITLES_GC_TIME_MS = 30 * 60 * 1000;

export const titleQueryKeys = {
  all: ['titles'] as const,
};

export const useTitles = () =>
  useQuery({
    queryKey: titleQueryKeys.all,
    queryFn: ({ signal }) => fetchTitles(signal),
    staleTime: TITLES_STALE_TIME_MS,
    gcTime: TITLES_GC_TIME_MS,
  });
