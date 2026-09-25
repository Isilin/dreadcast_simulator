import type {
  ImplantPrerequisiteDto,
  RacePrerequisiteDto,
  TitlePrerequisiteDto,
} from './prerequisite.schema';
import type { Prerequisite } from '../model/prerequisite.types';

import type { StatModifier } from '@/domain';

interface PrerequisitesDto {
  stats?: StatModifier[];
  /** Absent from API deployments older than the title prerequisites. */
  titles?: TitlePrerequisiteDto[];
  /** Absent from API deployments older than the implant prerequisites. */
  implants?: ImplantPrerequisiteDto[];
  /**
   * One row per allowed race: grouped in a single prerequisite, met by any of
   * them. Absent from API deployments older than the race prerequisites.
   */
  races?: RacePrerequisiteDto[];
}

const racePrerequisites = (races: RacePrerequisiteDto[]): Prerequisite[] =>
  races.length > 0
    ? [{ kind: 'race', races: races.map(({ race }) => race) }]
    : [];

export const toPrerequisites = ({
  stats = [],
  titles = [],
  implants = [],
  races = [],
}: PrerequisitesDto): Prerequisite[] => [
  ...stats.map(
    ({ property, value }): Prerequisite => ({ kind: 'stat', property, value }),
  ),
  ...titles.map(
    ({ title_id }): Prerequisite => ({ kind: 'title', titleId: title_id }),
  ),
  ...implants.flatMap(({ implant }): Prerequisite[] =>
    implant ? [{ kind: 'implant', implant: implant.name }] : [],
  ),
  ...racePrerequisites(races),
];
