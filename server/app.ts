import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

import { registerDocs } from './api.docs.js';
import type { Deps } from './deps.js';
import { authRoutes } from './feature/auth/auth.routes.js';
import { buildRoutes } from './feature/build/build.routes.js';
import { catalogRoutes } from './feature/catalog/catalog.routes.js';
import { communityRoutes } from './feature/community/community.routes.js';
import { profileRoutes } from './feature/profile/profile.routes.js';
import { subscriptionRoutes } from './feature/subscription/subscription.routes.js';
import { makeAuthMiddlewares } from './platform/auth.js';
import { isDbError } from './platform/db-error.js';
import { healthRoutes } from './platform/health.js';
import { isHttpError } from './platform/http-errors.js';
import { unreadableBodyError } from './platform/request-validation.js';

/**
 * HTTP API under /api, over the given services (real ones in production,
 * fakes in tests). Same contract as the former Effect HttpApi: URLs, JSON
 * bodies, statuses and `{ error, code? }` errors.
 */
export const createApp = (deps: Deps) => {
  const auth = makeAuthMiddlewares(deps.auth.resolve);

  const api = new OpenAPIHono()
    .route('/', catalogRoutes(deps.catalog))
    .route('/', authRoutes(deps.auth, auth))
    .route('/', buildRoutes(deps.builds, auth))
    .route('/', subscriptionRoutes(deps.subscriptions, auth))
    .route('/', profileRoutes(deps.profiles, auth))
    .route('/', communityRoutes(deps, auth))
    .route('/', healthRoutes(deps.checkDatabase));

  const app = new OpenAPIHono().route('/api', api);
  registerDocs(app);

  app.onError((error, c) => {
    if (isHttpError(error)) {
      return c.json(error.body, error.status);
    }
    // Unexpected database failure: 500 with the raw message, as before.
    if (isDbError(error)) {
      return c.json({ error: error.message }, 500);
    }
    // Malformed JSON or unsupported media type, rejected before validation.
    if (error instanceof HTTPException && error.status < 500) {
      const invalid = unreadableBodyError(c);
      return c.json(invalid.body, invalid.status);
    }
    // eslint-disable-next-line no-console -- server log of unexpected errors
    console.error(error);
    return c.json({ error: 'Erreur interne.' }, 500);
  });

  return app;
};

/** Type of the API, for the typed client of the front (hono/client). */
export type AppType = ReturnType<typeof createApp>;
