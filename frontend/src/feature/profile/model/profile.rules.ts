import { type Race, type RaceType } from './profile.types';

export const findRaceStats = (
  races: Race[] | undefined,
  raceType: RaceType,
): Race | undefined => races?.find((race) => race.type === raceType);
