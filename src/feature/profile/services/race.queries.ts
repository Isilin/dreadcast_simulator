import { useQuery } from '@tanstack/react-query';

import { fetchRaces } from './race.repo';

export const useRaces = () =>
  useQuery({
    queryKey: ['races'],
    queryFn: fetchRaces,
  });
