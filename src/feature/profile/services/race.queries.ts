import { useQuery } from '@tanstack/react-query';

import { fetchRaces } from './race.repo';

const RACES_STALE_TIME_MS = 5 * 60 * 1000;
const RACES_GC_TIME_MS = 30 * 60 * 1000;

const raceQueryKeys = {
  all: ['races'] as const,
};

export const useRaces = () =>
  useQuery({
    queryKey: raceQueryKeys.all,
    queryFn: ({ signal }) => fetchRaces(signal),
    staleTime: RACES_STALE_TIME_MS,
    gcTime: RACES_GC_TIME_MS,
  });
