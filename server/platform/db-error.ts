import { Data, Effect } from 'effect';

import { InternalError, NotFound } from './http-errors.js';

/** Failure of a Supabase call (PostgREST, RPC exception, network). */
export class DbError extends Data.TaggedError('DbError')<{
  readonly code?: string;
  readonly message: string;
}> {}

/** Unexpected database failure: 500 with the raw message, as before. */
export const toInternalError = (error: DbError) =>
  new InternalError({ error: error.message });

/** `.single()` found no row (PGRST116) -> 404, anything else -> 500. */
export const notFoundOrInternal =
  (notFoundMessage: string) => (error: DbError) =>
    error.code === 'PGRST116'
      ? Effect.fail(new NotFound({ error: notFoundMessage }))
      : Effect.fail(toInternalError(error));
