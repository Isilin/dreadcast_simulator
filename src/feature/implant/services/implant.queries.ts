import { useQuery } from '@tanstack/react-query';

import { fetchImplants } from './implant.repo';

const IMPLANTS_STALE_TIME_MS = 5 * 60 * 1000;
const IMPLANTS_GC_TIME_MS = 30 * 60 * 1000;

const implantQueryKeys = {
  all: ['implants'] as const,
};

export const useImplants = () =>
  useQuery({
    queryKey: implantQueryKeys.all,
    queryFn: ({ signal }) => fetchImplants(signal),
    staleTime: IMPLANTS_STALE_TIME_MS,
    gcTime: IMPLANTS_GC_TIME_MS,
  });
