import type { Stat } from '@/domain';
import type { ImplantName, ImplantsState } from '@/feature/implant';
import type { RaceType } from '@/feature/profile';
import type { TitlesState } from '@/feature/title';

/** Condition to use an item or a kit. */
export type Prerequisite =
  | { kind: 'stat'; property: Stat; value: number }
  | { kind: 'title'; titleId: string }
  | { kind: 'implant'; implant: ImplantName }
  /** Met by any of the races, e.g. a kit named after its race. */
  | { kind: 'race'; races: RaceType[] };

/** What the character has, to check prerequisites against. */
export interface PrerequisiteContext {
  /** Race plus implants: equipment, kits and drugs do not count. */
  pureStats: Record<Stat, number>;
  race: RaceType;
  titles: TitlesState;
  implants: ImplantsState;
}
