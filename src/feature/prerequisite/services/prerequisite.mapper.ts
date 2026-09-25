import type {
  ImplantPrerequisiteDto,
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
}

export const toPrerequisites = ({
  stats = [],
  titles = [],
  implants = [],
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
];
