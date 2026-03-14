import { useQuery } from '@tanstack/react-query';

import type { Kit } from '../model';
import { fetchKitById, fetchKits } from './kit.repo';

const KITS_STALE_TIME_MS = 5 * 60 * 1000;
const KITS_GC_TIME_MS = 30 * 60 * 1000;

export const kitQueryKeys = {
  all: ['kits'] as const,
  list: (type?: Kit['type'] | Array<Kit['type']>) =>
    ['kits', { type: type ?? [] }] as const,
  detail: (id?: string | null) => ['kit', id ?? null] as const,
};

export const useKits = (type?: Kit['type'] | Array<Kit['type']>) =>
  useQuery({
    queryKey: kitQueryKeys.list(type),
    queryFn: ({ signal }) => fetchKits(type, signal),
    staleTime: KITS_STALE_TIME_MS,
    gcTime: KITS_GC_TIME_MS,
  });

export const useKit = (id?: string | null) =>
  useQuery({
    queryKey: kitQueryKeys.detail(id),
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error('Kit ID manquant');
      }
      return fetchKitById(id, signal);
    },
    enabled: Boolean(id),
    staleTime: KITS_STALE_TIME_MS,
    gcTime: KITS_GC_TIME_MS,
  });
