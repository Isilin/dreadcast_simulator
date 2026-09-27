import { Context, Effect } from 'effect';
import type * as HttpApiError from 'effect/unstable/httpapi/HttpApiError';
import * as HttpApiMiddleware from 'effect/unstable/httpapi/HttpApiMiddleware';

import { BadRequest, Unprocessable } from './http-errors.js';

export type InvalidRequestHandler = (
  error: HttpApiError.HttpApiSchemaError,
) => BadRequest | Unprocessable;

/**
 * Endpoint annotation mapping a request decoding failure (params, query,
 * payload) to the legacy `{ error, code }` body the front displays.
 */
export const InvalidRequest = Context.Reference<InvalidRequestHandler>(
  'api/InvalidRequest',
  {
    defaultValue: () => () =>
      new BadRequest({ error: 'Requete invalide.', code: 'INVALID_PAYLOAD' }),
  },
);

export class RequestValidation extends HttpApiMiddleware.Service<RequestValidation>()(
  'api/RequestValidation',
  { error: [BadRequest, Unprocessable] },
) {}

export const RequestValidationLive =
  HttpApiMiddleware.layerSchemaErrorTransform(
    RequestValidation,
    (error, { endpoint }) =>
      error.kind === 'ResponseHeaders'
        ? Effect.fail(error)
        : Effect.fail(Context.get(endpoint.annotations, InvalidRequest)(error)),
  );
