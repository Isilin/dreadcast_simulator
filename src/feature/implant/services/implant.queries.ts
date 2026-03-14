import { useQuery } from '@tanstack/react-query';

import { fetchImplantByName, fetchImplants } from './implant.repo';

const IMPLANTS_STALE_TIME_MS = 5 * 60 * 1000;
const IMPLANTS_GC_TIME_MS = 30 * 60 * 1000;

export const implantQueryKeys = {
  all: ['implants'] as const,
  list: (search?: string) => ['implants', { search: search ?? '' }] as const,
  detail: (name?: string | null) => ['implant', name ?? null] as const,
};

export const useImplants = (search?: string) =>
  useQuery({
    queryKey: implantQueryKeys.list(search),
    queryFn: ({ signal }) => fetchImplants(search, signal),
    staleTime: IMPLANTS_STALE_TIME_MS,
    gcTime: IMPLANTS_GC_TIME_MS,
  });

export const useImplant = (name?: string | null) =>
  useQuery({
    queryKey: implantQueryKeys.detail(name),
    queryFn: ({ signal }) => {
      if (!name) {
        throw new Error("Nom d'implant manquant");
      }
      return fetchImplantByName(name, signal);
    },
    enabled: Boolean(name),
    staleTime: IMPLANTS_STALE_TIME_MS,
    gcTime: IMPLANTS_GC_TIME_MS,
  });
