import { useQuery } from '@tanstack/react-query';

import { fetchImplants } from './implant.repo';

export const useImplants = () =>
  useQuery({
    queryKey: ['implants'],
    queryFn: () => fetchImplants(),
  });
