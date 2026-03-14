import { useQuery } from '@tanstack/react-query';

import { fetchRaceByType, fetchRaces } from './race.repo';

const RACES_STALE_TIME_MS = 5 * 60 * 1000;
const RACES_GC_TIME_MS = 30 * 60 * 1000;

export const raceQueryKeys = {
  all: ['races'] as const,
  list: () => ['races', 'list'] as const,
  detail: (type?: string | null) => ['race', type ?? null] as const,
};

export const useRaces = () =>
  useQuery({
    queryKey: raceQueryKeys.list(),
    queryFn: ({ signal }) => fetchRaces(signal),
    staleTime: RACES_STALE_TIME_MS,
    gcTime: RACES_GC_TIME_MS,
  });

export const useRace = (type?: string | null) =>
  useQuery({
    queryKey: raceQueryKeys.detail(type),
    queryFn: ({ signal }) => {
      if (!type) {
        throw new Error('Type de race manquant');
      }
      return fetchRaceByType(type, signal);
    },
    enabled: Boolean(type),
    staleTime: RACES_STALE_TIME_MS,
    gcTime: RACES_GC_TIME_MS,
  });
