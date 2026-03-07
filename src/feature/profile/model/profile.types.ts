import type { Stat } from '@/domain';

export const RaceTypeValues = [
  'Humain',
  'Elfe',
  'Nain',
  'Orc',
  'Troll',
  'Outrilien',
  'Vautour',
  'Gobelin',
  'Kobold',
  'Gnoll',
  'Androide',
] as const;
export type RaceType = (typeof RaceTypeValues)[number];

export type RaceAttributes = {
  [key in Stat]?: number;
};

export type Race = RaceAttributes & { type: RaceType };

export type Gender = 'male' | 'female';

export interface ProfileState {
  race: RaceType;
  gender: Gender;
}
