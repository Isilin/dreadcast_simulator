import { useMemo } from 'react';

import { computePureStats, findUnmetPrerequisites } from './prerequisite.rules';
import type { Prerequisite, PrerequisiteContext } from './prerequisite.types';

import { useImplantsEffects, useImplantsState } from '@/feature/implant';
import { useRaceStats } from '@/feature/profile';
import { useTitlesState } from '@/feature/title';

/** Race, implants and titles of the current build. */
export const usePrerequisiteContext = (): PrerequisiteContext => {
  const raceStats = useRaceStats();
  const implantsEffects = useImplantsEffects();
  const implants = useImplantsState();
  const titles = useTitlesState();

  return useMemo(
    () => ({
      pureStats: computePureStats(raceStats, implantsEffects),
      titles,
      implants,
    }),
    [implants, implantsEffects, raceStats, titles],
  );
};

export const useUnmetPrerequisites = (
  prerequisites: Prerequisite[] | undefined,
): Prerequisite[] => {
  const context = usePrerequisiteContext();
  return useMemo(
    () => findUnmetPrerequisites(prerequisites, context),
    [context, prerequisites],
  );
};
