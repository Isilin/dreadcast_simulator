import { createRoute, z } from '@hono/zod-openapi';

import type { BuildRepo } from './build.repo.js';
import { findBySlot, toBuildDto } from './build.rules.js';
import { Build, SlotQuery, UpsertBuildPayload } from './build.schema.js';
import type { AuthMiddlewares, User } from '../../platform/auth.js';
import { noStore } from '../../platform/cache.js';
import type { Json } from '../../platform/database.gen.js';
import {
  badRequest,
  errorResponses,
  forbidden,
  notFound,
} from '../../platform/http-errors.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  jsonBody,
  jsonContent,
  middlewares,
} from '../../platform/router.js';

/** Saved builds of the signed-in user, addressed by 1-based slot. */
export const buildRoutes = (
  builds: (user: User) => BuildRepo,
  { requireUser }: AuthMiddlewares,
) => {
  const listRoute = createRoute({
    method: 'get',
    path: '/builds',
    tags: ['builds'],
    middleware: middlewares(noStore, requireUser),
    responses: {
      200: jsonContent(z.array(Build), 'Builds in slot order'),
      ...errorResponses(401, 500),
    },
  });

  const upsertRoute = createRoute({
    method: 'put',
    path: '/builds',
    tags: ['builds'],
    middleware: middlewares(
      noStore,
      requireUser,
      invalidRequestAs(() => badRequest('Payload build invalide.')),
    ),
    request: { body: jsonBody(UpsertBuildPayload) },
    responses: {
      200: jsonContent(Build, 'Saved build'),
      ...errorResponses(400, 401, 500),
    },
  });

  const removeRoute = createRoute({
    method: 'delete',
    path: '/builds',
    tags: ['builds'],
    description: 'The next slots move up.',
    middleware: middlewares(
      noStore,
      requireUser,
      invalidRequestAs(() => badRequest('Slot de build invalide.')),
    ),
    request: { query: SlotQuery },
    responses: {
      204: { description: 'Deleted' },
      ...errorResponses(400, 401, 403, 404, 500),
    },
  });

  return featureRouter()
    .openapi(listRoute, async (c) => {
      const rows = await builds(c.var.user).listOrdered();
      return c.json(
        rows.map((row, index) => toBuildDto(row, index + 1)),
        200,
      );
    })
    .openapi(upsertRoute, async (c) => {
      const repo = builds(c.var.user);
      const payload = c.req.valid('json');
      const savedAt = new Date().toISOString();
      const snapshot = payload.snapshot as Json;
      const rows = await repo.listOrdered();
      const target = findBySlot(rows, payload.slot);

      if (target) {
        const row = await repo.update(target.id, snapshot, savedAt);
        return c.json(toBuildDto(row, payload.slot), 200);
      }

      const row = await repo.insert(snapshot, savedAt);
      return c.json(toBuildDto(row, rows.length + 1), 200);
    })
    .openapi(removeRoute, async (c) => {
      const repo = builds(c.var.user);
      const rows = await repo.listOrdered();
      const target = findBySlot(rows, c.req.valid('query').slot);
      if (!target) {
        throw notFound('Build introuvable.');
      }

      // Row level security skips the row silently when deletion is refused.
      if ((await repo.remove(target.id)).length === 0) {
        throw forbidden('Suppression du build refusée.');
      }
      return c.body(null, 204);
    });
};
