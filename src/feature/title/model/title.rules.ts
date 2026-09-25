import type { Title, TitlesState } from './title.types';

/**
 * Unlocks or locks a title. The ids stay sorted so that two builds with the
 * same titles compare equal.
 */
export const toggleTitleId = (state: TitlesState, id: string): TitlesState =>
  state.includes(id)
    ? state.filter((titleId) => titleId !== id)
    : [...state, id].sort();

/** Id to name lookup of the title catalogue. */
export const indexTitleNames = (
  titles: Title[] | undefined,
): Record<string, string> =>
  Object.fromEntries((titles ?? []).map(({ id, name }) => [id, name]));
