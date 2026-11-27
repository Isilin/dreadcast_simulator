import type { Hook } from '@hono/zod-openapi';
import type { Context, ValidationTargets } from 'hono';
import { createMiddleware } from 'hono/factory';
import { ZodError } from 'zod';

import { badRequest, type HttpError } from './http-errors.js';

/** Part of the request that failed validation. */
export type RequestPart = keyof ValidationTargets;

/**
 * Maps a request validation failure (params, query, body) to the legacy
 * `{ error, code }` body the front displays.
 */
export type InvalidRequest = (error: ZodError, part: RequestPart) => HttpError;

/** Generic answer of a route without its own mapping. */
export const genericInvalidRequest: InvalidRequest = () =>
  badRequest('Requete invalide.', 'INVALID_PAYLOAD');

interface InvalidRequestVariables {
  invalidRequest: InvalidRequest;
}

/**
 * Route middleware choosing the error of a validation failure. Route
 * middlewares run before the validators, so the hook finds it on the context
 * (a per-route hook argument would break the inference of `c.req.valid`).
 */
export const invalidRequestAs = (toError: InvalidRequest) =>
  createMiddleware<{ Variables: InvalidRequestVariables }>(async (c, next) => {
    c.set('invalidRequest', toError);
    await next();
  });

/** Mapping of the current route (set by invalidRequestAs), else generic. */
const routeInvalidRequest = (c: Context): InvalidRequest =>
  (c.get as (key: string) => InvalidRequest | undefined)('invalidRequest') ??
  genericInvalidRequest;

/**
 * Validation hook of every router: throws the route's error (rendered by the
 * app's error handler), the generic 400 by default.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any route
export const defaultHook: Hook<any, any, any, undefined> = (result, c) => {
  if (!result.success) {
    throw routeInvalidRequest(c)(result.error, result.target);
  }
  return undefined;
};

/**
 * Body rejected before validation (malformed JSON, unsupported media type):
 * the route's error, as for any invalid body.
 */
export const unreadableBodyError = (c: Context): HttpError =>
  routeInvalidRequest(c)(new ZodError([]), 'json');
