import { z } from '@hono/zod-openapi';

/**
 * Wire body of every API error: `{ error, code? }`, identical to the legacy
 * handlers (the front displays `error` and branches on `code`).
 */
export const ErrorBody = z
  .object({
    error: z.string(),
    code: z.string().optional(),
  })
  .openapi('Error');

export type ErrorBody = z.infer<typeof ErrorBody>;

export type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;

/**
 * Error answered as `status` with `{ error, code? }`. Thrown by handlers and
 * middlewares, rendered by the app's error handler.
 */
export class HttpError extends Error {
  readonly status: ErrorStatus;
  readonly code: string | undefined;

  constructor(status: ErrorStatus, error: string, code?: string) {
    super(error);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }

  get body(): ErrorBody {
    return this.code === undefined
      ? { error: this.message }
      : { error: this.message, code: this.code };
  }
}

const httpError =
  (status: ErrorStatus) =>
  (error: string, code?: string): HttpError =>
    new HttpError(status, error, code);

export const badRequest = httpError(400);
export const unauthorized = httpError(401);
export const forbidden = httpError(403);
export const notFound = httpError(404);
export const conflict = httpError(409);
export const unprocessable = httpError(422);
export const internalError = httpError(500);

export const isHttpError = (value: unknown): value is HttpError =>
  value instanceof HttpError;

/** OpenAPI documentation of the error responses of a route. */
export const errorResponses = <const S extends ErrorStatus>(
  ...statuses: ReadonlyArray<S>
) =>
  Object.fromEntries(
    statuses.map((status) => [
      status,
      {
        description: ERROR_DESCRIPTIONS[status],
        content: { 'application/json': { schema: ErrorBody } },
      },
    ]),
  ) as {
    [K in S]: {
      description: string;
      content: { 'application/json': { schema: typeof ErrorBody } };
    };
  };

/** Every error status, for routes that may answer with any of them. */
export const ALL_ERRORS = [400, 401, 403, 404, 409, 422, 500] as const;

const ERROR_DESCRIPTIONS: Record<ErrorStatus, string> = {
  400: 'Invalid request',
  401: 'Not signed in',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  422: 'Unprocessable',
  500: 'Internal error',
};
