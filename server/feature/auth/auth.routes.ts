import { createRoute } from '@hono/zod-openapi';

import type { AuthGateway } from './auth.gateway.js';
import { LoginPayload, LoginResponse } from './auth.schema.js';
import { noStore } from '../../platform/cache.js';
import { badRequest, errorResponses } from '../../platform/http-errors.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  jsonBody,
  jsonContent,
  middlewares,
} from '../../platform/router.js';

const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['auth'],
  description:
    'Password sign-in through the server; the front then sets the session.',
  middleware: middlewares(
    noStore,
    invalidRequestAs(() => badRequest('Payload de connexion invalide')),
  ),
  request: { body: jsonBody(LoginPayload) },
  responses: {
    200: jsonContent(LoginResponse, 'Session tokens'),
    ...errorResponses(400, 401, 500),
  },
});

export const authRoutes = (gateway: AuthGateway) =>
  featureRouter().openapi(loginRoute, async (c) => {
    const { email, password } = c.req.valid('json');
    return c.json(await gateway.signInWithPassword(email, password), 200);
  });
