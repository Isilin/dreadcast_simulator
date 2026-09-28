import { DreadcastApi } from '@server/api.contract';
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalError,
  NotFound,
  Unauthorized,
  Unprocessable,
} from '@server/platform/http-errors';
import { InvalidRequest } from '@server/platform/request-validation';
import { Cause, Context, Effect, Exit, Schema } from 'effect';
import * as FetchHttpClient from 'effect/unstable/http/FetchHttpClient';
import * as HttpClient from 'effect/unstable/http/HttpClient';
import * as HttpClientError from 'effect/unstable/http/HttpClientError';
import * as HttpClientRequest from 'effect/unstable/http/HttpClientRequest';
import * as HttpApiClient from 'effect/unstable/httpapi/HttpApiClient';
import { HttpApiSchemaError } from 'effect/unstable/httpapi/HttpApiError';

import type {
  RepositoryError,
  RepositoryErrorParams,
} from './repository-error';

/**
 * Typed client of the backend, derived from its HttpApi contract: request
 * encoding and response decoding follow the server schemas.
 *
 * Loaded lazily by the repositories (`await import('@/utils/api-client')`) so
 * Effect stays out of the initial bundle.
 */
export type ApiClient = HttpApiClient.ForApi<typeof DreadcastApi>;

interface ErrorSpec {
  code: string;
  message: string;
}

export interface ApiCallOptions {
  signal?: AbortSignal;
  /** Session token; omitted for guest calls. */
  accessToken?: string;
  /** Repository error class of the feature. */
  ErrorClass: new (params: RepositoryErrorParams) => RepositoryError;
  /** Request refused or failed. */
  failed: ErrorSpec;
  /** Response not matching the contract. */
  invalid: ErrorSpec;
  /** Report the API `error` message and `code` instead of `failed`. */
  apiMessage?: boolean;
  /**
   * Endpoint called, for requests the contract rejects before sending them
   * (the client validates what it encodes): they get the error the server
   * would have answered (its `InvalidRequest` annotation).
   */
  request?: {
    group: string;
    endpoint: string;
    part: HttpApiSchemaError['kind'];
  };
}

const API_ERROR_STATUSES = [
  [BadRequest, 400],
  [Unauthorized, 401],
  [Forbidden, 403],
  [NotFound, 404],
  [Conflict, 409],
  [Unprocessable, 422],
  [InternalError, 500],
] as const;

const responseStatus = (error: unknown): number | undefined =>
  HttpClientError.isHttpClientError(error) && 'response' in error.reason
    ? error.reason.response.status
    : undefined;

/** Error the server answers to an invalid request of this endpoint. */
const serverRequestError = (
  request: NonNullable<ApiCallOptions['request']>,
  cause: Schema.SchemaError,
) => {
  const groups = DreadcastApi.groups as Record<
    string,
    {
      readonly endpoints: Record<
        string,
        { readonly annotations: Context.Context<never> }
      >;
    }
  >;
  const endpoint = groups[request.group]?.endpoints[request.endpoint];
  return endpoint
    ? Context.get(
        endpoint.annotations,
        InvalidRequest,
      )(new HttpApiSchemaError({ kind: request.part, cause }))
    : undefined;
};

const toRepositoryError = (
  error: unknown,
  requestSent: boolean,
  options: ApiCallOptions,
): RepositoryError => {
  const { ErrorClass, failed, invalid, apiMessage } = options;

  if (Schema.isSchemaError(error) && !requestSent && options.request) {
    const serverError = serverRequestError(options.request, error);
    if (serverError) {
      return toRepositoryError(serverError, requestSent, {
        ...options,
        apiMessage: true,
      });
    }
  }

  for (const [ApiError, status] of API_ERROR_STATUSES) {
    if (error instanceof ApiError) {
      return new ErrorClass({
        code: apiMessage ? (error.code ?? failed.code) : failed.code,
        message: apiMessage ? error.error : failed.message,
        status,
        cause: error,
      });
    }
  }

  if (Schema.isSchemaError(error)) {
    return new ErrorClass({ ...invalid, cause: error });
  }

  return new ErrorClass({
    ...failed,
    status: responseStatus(error),
    cause: error,
  });
};

/**
 * Runs one call of the typed client as a Promise (TanStack Query). Failures
 * become the feature's RepositoryError.
 */
export const callApi = async <A, E>(
  call: (client: ApiClient) => Effect.Effect<A, E>,
  options: ApiCallOptions,
): Promise<A> => {
  const { accessToken, signal } = options;
  let requestSent = false;

  const program = HttpApiClient.make(DreadcastApi, {
    transformClient: (client) =>
      (accessToken
        ? HttpClient.mapRequest(
            client,
            HttpClientRequest.bearerToken(accessToken),
          )
        : client
      ).pipe(
        HttpClient.tapRequest(() =>
          Effect.sync(() => {
            requestSent = true;
          }),
        ),
      ),
  }).pipe(Effect.flatMap(call), Effect.provide(FetchHttpClient.layer));

  const exit = await Effect.runPromiseExit(program, { signal });
  if (Exit.isSuccess(exit)) {
    return exit.value;
  }

  throw toRepositoryError(Cause.squash(exit.cause), requestSent, options);
};
