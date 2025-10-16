import { useMemo } from 'react';

import { useRaces } from '../services';
import { useProfileState } from './profile.hooks';
import { findRaceStats } from './profile.rules';

export const useRaceStats = () => {
  const { data: races } = useRaces();
  const { race } = useProfileState();

  return useMemo(() => findRaceStats(races, race), [race, races]);
};
