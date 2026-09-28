import { Effect, Layer } from 'effect';
import { HttpServerResponse } from 'effect/unstable/http';
import * as HttpApiMiddleware from 'effect/unstable/httpapi/HttpApiMiddleware';

/**
 * Reference data (catalog, game versions): cached by browsers and the Vercel
 * CDN for 1h. Only successful responses carry the header.
 */
export class PublicCache extends HttpApiMiddleware.Service<PublicCache>()(
  'api/PublicCache',
) {}

/** Per-user data: never cached. */
export class NoStore extends HttpApiMiddleware.Service<NoStore>()(
  'api/NoStore',
) {}

const PUBLIC_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export const PublicCacheLive = Layer.succeed(PublicCache, (httpEffect) =>
  Effect.map(httpEffect, HttpServerResponse.setHeaders(PUBLIC_CACHE_HEADERS)),
);

export const NoStoreLive = Layer.succeed(NoStore, (httpEffect) =>
  Effect.map(httpEffect, HttpServerResponse.setHeaders(NO_STORE_HEADERS)),
);
