import { Schema } from 'effect';

/**
 * Wire body of every API error: `{ error, code? }`, identical to the legacy
 * handlers (the front displays `error` and branches on `code`).
 */
const errorFields = {
  error: Schema.String,
  code: Schema.optionalKey(Schema.String),
};

export class BadRequest extends Schema.Error<BadRequest>('api/BadRequest')(
  errorFields,
  { httpApiStatus: 400 },
) {}

export class Unauthorized extends Schema.Error<Unauthorized>(
  'api/Unauthorized',
)(errorFields, { httpApiStatus: 401 }) {}

export class Forbidden extends Schema.Error<Forbidden>('api/Forbidden')(
  errorFields,
  { httpApiStatus: 403 },
) {}

export class NotFound extends Schema.Error<NotFound>('api/NotFound')(
  errorFields,
  { httpApiStatus: 404 },
) {}

export class Conflict extends Schema.Error<Conflict>('api/Conflict')(
  errorFields,
  { httpApiStatus: 409 },
) {}

export class Unprocessable extends Schema.Error<Unprocessable>(
  'api/Unprocessable',
)(errorFields, { httpApiStatus: 422 }) {}

export class InternalError extends Schema.Error<InternalError>(
  'api/InternalError',
)(errorFields, { httpApiStatus: 500 }) {}

export type ApiError =
  | BadRequest
  | Unauthorized
  | Forbidden
  | NotFound
  | Conflict
  | Unprocessable
  | InternalError;

/** Every error class, for endpoints that may answer with any of them. */
export const ApiErrors = [
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  Unprocessable,
  InternalError,
] as const;
