import { internalError, notFound, type HttpError } from './http-errors.js';

/**
 * Failure of a database call (PostgREST error, RPC exception, network).
 * Uncaught, it becomes a 500 with its raw message, as before.
 */
export class DbError extends Error {
  readonly code: string | undefined;

  constructor({ code, message }: { code?: string; message: string }) {
    super(message);
    this.name = 'DbError';
    this.code = code;
  }
}

export const isDbError = (value: unknown): value is DbError =>
  value instanceof DbError;

/** Unexpected database failure: 500 with the raw message. */
export const toInternalError = (error: DbError): HttpError =>
  internalError(error.message);

/** `.single()` found no row (PGRST116) -> 404, anything else -> 500. */
export const notFoundOrInternal =
  (notFoundMessage: string) =>
  (error: DbError): HttpError =>
    error.code === 'PGRST116'
      ? notFound(notFoundMessage)
      : toInternalError(error);

/**
 * Awaits a repository call and translates its DbError with `toHttpError`;
 * other failures (HttpError included) pass through.
 */
export const mapDbError = async <A>(
  promise: Promise<A>,
  toHttpError: (error: DbError) => HttpError | A,
): Promise<A> => {
  try {
    return await promise;
  } catch (error) {
    if (!isDbError(error)) {
      throw error;
    }
    const mapped = toHttpError(error);
    if (mapped instanceof Error) {
      throw mapped;
    }
    return mapped;
  }
};
