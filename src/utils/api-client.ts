import type { AppType } from '@server/app';
import { hc, type ClientResponse } from 'hono/client';
import type { SuccessStatusCode } from 'hono/utils/http-status';

import type {
  RepositoryError,
  RepositoryErrorParams,
} from './repository-error';

/**
 * Typed client of the backend (Hono RPC): paths, parameters, bodies and
 * responses come from the server routes, as types only.
 */
export type ApiClient = ReturnType<typeof hc<AppType>>;

interface ErrorSpec {
  code: string;
  message: string;
}

export interface ApiCallOptions {
  signal?: AbortSignal;
  /** Repository error class of the feature. */
  ErrorClass: new (params: RepositoryErrorParams) => RepositoryError;
  /** Request refused or failed. */
  failed: ErrorSpec;
  /** Response body that is not JSON. */
  invalid: ErrorSpec;
  /** Report the API `error` message and `code` instead of `failed`. */
  apiMessage?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any route
type AnyResponse = ClientResponse<any, number, any>;

/** Body of the successful responses of a call. */
export type SuccessBody<R> =
  R extends ClientResponse<infer T, infer S, infer _F>
    ? S extends SuccessStatusCode
      ? T
      : never
    : never;

interface ApiErrorBody {
  error: string;
  code?: string;
}

type UnauthorizedListener = () => void;
let unauthorizedListener: UnauthorizedListener | undefined;

/**
 * Called on every 401: the session cookie is missing or dead (the auth
 * feature then forgets the signed-in user).
 */
export const onUnauthorized = (listener: UnauthorizedListener) => {
  unauthorizedListener = listener;
};

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { error?: unknown }).error === 'string';

/**
 * Runs one call of the typed client (TanStack Query). The session travels in
 * its HttpOnly cookie (same origin). Failures become the feature's
 * RepositoryError: API errors keep their status, and with `apiMessage` their
 * `{ error, code }`.
 */
export const callApi = async <R extends AnyResponse>(
  call: (client: ApiClient) => Promise<R>,
  options: ApiCallOptions,
): Promise<SuccessBody<R>> => {
  const { signal, ErrorClass, failed, invalid, apiMessage } = options;
  const client = hc<AppType>('/', { init: { signal } });

  let response: R;
  try {
    response = await call(client);
  } catch (cause) {
    throw new ErrorClass({ ...failed, cause });
  }

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedListener?.();
    }
    const body: unknown = await response.json().catch(() => undefined);
    const fromApi = apiMessage && isApiErrorBody(body) ? body : undefined;
    throw new ErrorClass({
      code: fromApi ? (fromApi.code ?? failed.code) : failed.code,
      message: fromApi ? fromApi.error : failed.message,
      status: response.status,
      cause: body,
    });
  }

  if (response.status === 204) {
    return undefined as SuccessBody<R>;
  }

  try {
    return (await response.json()) as SuccessBody<R>;
  } catch (cause) {
    throw new ErrorClass({ ...invalid, cause });
  }
};
