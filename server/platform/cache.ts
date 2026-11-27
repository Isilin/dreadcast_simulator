import { createMiddleware } from 'hono/factory';

/**
 * Reference data (catalog, game versions): cached by browsers and the CDN for
 * 1h. Only successful responses carry the header.
 */
const PUBLIC_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

/** Per-user data: never cached (successful responses, as before). */
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

const setOnSuccess = (headers: Record<string, string>) =>
  createMiddleware(async (c, next) => {
    await next();
    if (c.res.ok) {
      for (const [name, value] of Object.entries(headers)) {
        c.res.headers.set(name, value);
      }
    }
  });

export const publicCache = setOnSuccess(PUBLIC_CACHE_HEADERS);

export const noStore = setOnSuccess(NO_STORE_HEADERS);
