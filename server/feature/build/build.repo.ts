import type { BuildRow } from './build.rules.js';
import type { Json } from '../../platform/database.gen.js';

/** Builds of one user (row level security applies through their session). */
export interface BuildRepo {
  /** Ordered by creation: the index is the slot. */
  readonly listOrdered: () => Promise<ReadonlyArray<BuildRow>>;
  readonly update: (
    id: string,
    snapshot: Json,
    savedAt: string,
  ) => Promise<BuildRow>;
  readonly insert: (snapshot: Json, savedAt: string) => Promise<BuildRow>;
  /** Ids actually deleted: empty when row level security refused it. */
  readonly remove: (id: string) => Promise<ReadonlyArray<string>>;
}
