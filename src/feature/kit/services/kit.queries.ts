import { useQuery } from '@tanstack/react-query';

import type { Kit } from '../model';
import { fetchKits } from './kit.repo';

export const useKits = (type?: Kit['type'] | Array<Kit['type']>) =>
  useQuery({
    queryKey: ['kits', type],
    queryFn: () => fetchKits(type),
  });
