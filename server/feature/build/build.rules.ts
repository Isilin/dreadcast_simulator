import type { Build } from './build.schema.js';

export interface BuildRow {
  id: string;
  snapshot: unknown;
  saved_at: string;
}

/** Older rows stored the snapshot as a JSON string. */
export const parseSnapshot = (snapshot: unknown): unknown =>
  typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;

export const toBuildDto = (row: BuildRow, slot: number): Build => ({
  slot,
  snapshot: parseSnapshot(row.snapshot),
  saved_at: row.saved_at,
});

/**
 * Build occupying a 1-based slot. Slots follow the creation order, so the
 * next slots move up when a build is deleted.
 */
export const findBySlot = <Row>(
  orderedBuilds: ReadonlyArray<Row>,
  slot: number,
): Row | undefined => orderedBuilds[slot - 1];
