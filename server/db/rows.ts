import type { ZodType } from 'zod';

import { DbError, NO_ROWS } from '../platform/db-error.js';

/**
 * Validates rows whose SQL types are loose (function results, JSON and text
 * columns). A mismatch is a database error: 500, like any unexpected row.
 */
export const decodeRows =
  <A>(schema: ZodType<A>) =>
  (rows: unknown): A => {
    const result = schema.safeParse(rows);
    if (!result.success) {
      throw new DbError({ message: `Unexpected row: ${result.error.message}` });
    }
    return result.data;
  };

/** The only row: fails with NO_ROWS when there is none. */
export const single = <A>(rows: ReadonlyArray<A>): A => {
  const [row] = rows;
  if (row === undefined) {
    throw new DbError({ code: NO_ROWS, message: 'No row returned' });
  }
  return row;
};

/** The first row, null when there is none. */
export const firstOrNull = <A>(rows: ReadonlyArray<A>): A | null =>
  rows[0] ?? null;
