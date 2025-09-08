import type { Skill } from './skill';

export type RaceType =
  | 'Humain'
  | 'Elfe'
  | 'Nain'
  | 'Orc'
  | 'Troll'
  | 'Outrilien'
  | 'Vautour'
  | 'Gobelin'
  | 'Kobold'
  | 'Gnoll'
  | 'Androide';

export type RaceAttributes = {
  [key in Skill | 'health' | 'stamina']: number;
};

export type Race = RaceAttributes & { type: RaceType };
