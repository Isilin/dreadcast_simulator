import { useQuery } from '@tanstack/react-query';

import { fetchDrugById, fetchDrugs } from './drug.repo';

const DRUGS_STALE_TIME_MS = 5 * 60 * 1000;
const DRUGS_GC_TIME_MS = 30 * 60 * 1000;

const drugQueryKeys = {
  all: ['drugs'] as const,
  detail: (id?: string | null) => ['drug', id ?? null] as const,
};

export const useDrugs = () =>
  useQuery({
    queryKey: drugQueryKeys.all,
    queryFn: ({ signal }) => fetchDrugs(signal),
    staleTime: DRUGS_STALE_TIME_MS,
    gcTime: DRUGS_GC_TIME_MS,
  });

export const useDrug = (id?: string | null) =>
  useQuery({
    queryKey: drugQueryKeys.detail(id),
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error('Identifiant de drogue manquant');
      }
      return fetchDrugById(id, signal);
    },
    enabled: Boolean(id),
    staleTime: DRUGS_STALE_TIME_MS,
    gcTime: DRUGS_GC_TIME_MS,
  });
