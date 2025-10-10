import { useMemo } from 'react';

import { useRaces } from '../services';
import { useProfileState } from './profile.hooks';

export const useRaceStats = () => {
  const { data: races } = useRaces();
  const { race } = useProfileState();

  return useMemo(() => races?.find((r) => r.type === race), [race, races]);
};
