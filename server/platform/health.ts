import { createRoute, z } from '@hono/zod-openapi';

import { noStore } from './cache.js';
import { featureRouter, middlewares, jsonContent } from './router.js';

const Health = z.object({ status: z.enum(['ok', 'error']) });

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['health'],
  description: 'Container healthcheck: the API is up and reaches its database.',
  middleware: middlewares(noStore),
  responses: {
    200: jsonContent(Health, 'Healthy'),
    503: jsonContent(Health, 'Database unreachable'),
  },
});

export const healthRoutes = (checkDatabase: () => Promise<void>) =>
  featureRouter().openapi(healthRoute, async (c) => {
    try {
      await checkDatabase();
      return c.json({ status: 'ok' as const }, 200);
    } catch (error) {
      // eslint-disable-next-line no-console -- server log
      console.error('Healthcheck failed:', error);
      return c.json({ status: 'error' as const }, 503);
    }
  });
