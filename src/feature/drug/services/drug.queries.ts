import { useQuery } from '@tanstack/react-query';

import { fetchDrugs } from './drug.repo';

export const useDrugs = () =>
  useQuery({
    queryKey: ['drugs'],
    queryFn: fetchDrugs,
  });
