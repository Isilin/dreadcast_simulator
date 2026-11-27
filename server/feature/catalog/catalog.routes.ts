import { createRoute, z } from '@hono/zod-openapi';

import type { CatalogRepo } from './catalog.repo.js';
import { Drug, Implant, Item, Kit, Race, Title } from './catalog.schema.js';
import { publicCache } from '../../platform/cache.js';
import { mapDbError, notFoundOrInternal } from '../../platform/db-error.js';
import { errorResponses } from '../../platform/http-errors.js';
import {
  featureRouter,
  middlewares,
  jsonContent,
} from '../../platform/router.js';

const listRoute = <P extends string, S extends z.ZodType>(path: P, schema: S) =>
  createRoute({
    method: 'get',
    path,
    tags: ['catalog'],
    middleware: middlewares(publicCache),
    responses: {
      200: jsonContent(z.array(schema), 'OK'),
      ...errorResponses(500),
    },
  });

const drugsRoute = createRoute({
  method: 'get',
  path: '/drugs',
  tags: ['catalog'],
  description: '`?id=` returns a single drug (legacy query-string shape).',
  middleware: middlewares(publicCache),
  request: { query: z.object({ id: z.string().optional() }) },
  responses: {
    200: jsonContent(z.union([z.array(Drug), Drug]), 'OK'),
    ...errorResponses(404, 500),
  },
});

/** Public reference data of the simulator. */
export const catalogRoutes = (repo: CatalogRepo) =>
  featureRouter()
    .openapi(listRoute('/items', Item), async (c) =>
      c.json([...(await repo.items())], 200),
    )
    .openapi(listRoute('/kits', Kit), async (c) =>
      c.json([...(await repo.kits())], 200),
    )
    .openapi(listRoute('/implants', Implant), async (c) =>
      c.json([...(await repo.implants())], 200),
    )
    .openapi(listRoute('/races', Race), async (c) =>
      c.json([...(await repo.races())], 200),
    )
    .openapi(listRoute('/titles', Title), async (c) =>
      c.json([...(await repo.titles())], 200),
    )
    .openapi(drugsRoute, async (c) => {
      const id = c.req.valid('query').id?.trim();
      return id
        ? c.json(
            await mapDbError(
              repo.drug(id),
              notFoundOrInternal('Drug not found'),
            ),
            200,
          )
        : c.json([...(await repo.drugs())], 200);
    });
