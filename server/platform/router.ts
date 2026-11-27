import { OpenAPIHono, type z } from '@hono/zod-openapi';
import type { MiddlewareHandler } from 'hono';

import { defaultHook } from './request-validation.js';

/**
 * Router of one feature. Request validation failures answer the legacy
 * generic 400 unless the route passes its own hook (see onInvalid).
 */
export const featureRouter = () => new OpenAPIHono({ defaultHook });

/**
 * Middlewares of a route, as the mutable tuple createRoute needs to type the
 * variables they set (c.var.user...).
 */
export const middlewares = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any env
  M extends MiddlewareHandler<any, any, any>[],
>(
  ...handlers: M
): M => handlers;

/** JSON body of a response, for createRoute. */
export const jsonContent = <S extends z.ZodType>(
  schema: S,
  description: string,
) => ({
  description,
  content: { 'application/json': { schema } },
});

/** Required JSON request body, for createRoute. */
export const jsonBody = <S extends z.ZodType>(schema: S) => ({
  // Required: without it, a request lacking Content-Type skips validation.
  required: true,
  content: { 'application/json': { schema } },
});
