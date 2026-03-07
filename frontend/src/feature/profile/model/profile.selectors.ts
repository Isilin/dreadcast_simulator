import { useMemo } from 'react';

import { useRaces } from '../services';
import { findRaceStats } from './profile.rules';
import { useProfileState } from './profile.store';

export const useRaceStats = () => {
  const { data: races } = useRaces();
  const { race } = useProfileState();

  return useMemo(() => findRaceStats(races, race), [race, races]);
};
