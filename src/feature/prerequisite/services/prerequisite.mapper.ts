import type { Item as ItemDto } from '@server/feature/catalog/catalog.schema';

import type { Prerequisite } from '../model/prerequisite.types';

type StatPrerequisiteDto = ItemDto['item_prerequisite'][number];
type TitlePrerequisiteDto = ItemDto['item_prerequisite_title'][number];
type ImplantPrerequisiteDto = ItemDto['item_prerequisite_implant'][number];
type RacePrerequisiteDto = ItemDto['item_prerequisite_race'][number];

/** Prerequisite rows of an item or a kit (same shape for both). */
interface PrerequisitesDto {
  stats?: ReadonlyArray<StatPrerequisiteDto>;
  titles?: ReadonlyArray<TitlePrerequisiteDto>;
  implants?: ReadonlyArray<ImplantPrerequisiteDto>;
  /**
   * One row per allowed race: grouped in a single prerequisite, met by any of
   * them.
   */
  races?: ReadonlyArray<RacePrerequisiteDto>;
}

const racePrerequisites = (
  races: ReadonlyArray<RacePrerequisiteDto>,
): Prerequisite[] =>
  races.length > 0
    ? [{ kind: 'race', races: races.map(({ race }) => race) }]
    : [];

export const toPrerequisites = ({
  stats = [],
  titles = [],
  implants = [],
  races = [],
}: PrerequisitesDto): Prerequisite[] => [
  ...stats.map(({ property, value }): Prerequisite => ({
    kind: 'stat',
    property,
    value,
  })),
  ...titles.map(({ title_id }): Prerequisite => ({
    kind: 'title',
    titleId: title_id,
  })),
  ...implants.flatMap(({ implant }): Prerequisite[] =>
    implant ? [{ kind: 'implant', implant: implant.name }] : [],
  ),
  ...racePrerequisites(races),
];
