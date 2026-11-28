import { createRoute } from '@hono/zod-openapi';
import { getCookie, setCookie } from 'hono/cookie';

import { LoginPayload, SessionResponse } from './auth.schema.js';
import type { AuthService } from './auth.service.js';
import {
  clearSessionCookie,
  SESSION_COOKIE,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_PATH,
  type AuthMiddlewares,
  type User,
} from '../../platform/auth.js';
import { noStore } from '../../platform/cache.js';
import { badRequest, errorResponses } from '../../platform/http-errors.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  jsonBody,
  jsonContent,
  middlewares,
} from '../../platform/router.js';

const sessionBody = (user: User): SessionResponse => ({
  user: { id: user.userId, email: user.email },
});

const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['auth'],
  description:
    'Password sign-in: sets the HttpOnly session cookie (30 days, extended while used).',
  middleware: middlewares(
    noStore,
    invalidRequestAs(() => badRequest('Payload de connexion invalide')),
  ),
  request: { body: jsonBody(LoginPayload) },
  responses: {
    200: jsonContent(SessionResponse, 'Signed in'),
    ...errorResponses(400, 401, 429, 500),
  },
});

const logoutRoute = createRoute({
  method: 'post',
  path: '/auth/logout',
  tags: ['auth'],
  description: 'Ends the session of the cookie, if any.',
  middleware: middlewares(noStore),
  responses: {
    204: { description: 'Signed out' },
    ...errorResponses(500),
  },
});

export const authRoutes = (auth: AuthService, guards: AuthMiddlewares) => {
  const meRoute = createRoute({
    method: 'get',
    path: '/auth/me',
    tags: ['auth'],
    description: 'User of the session cookie.',
    middleware: middlewares(noStore, guards.requireUser),
    responses: {
      200: jsonContent(SessionResponse, 'Signed-in user'),
      ...errorResponses(401, 500),
    },
  });

  return featureRouter()
    .openapi(loginRoute, async (c) => {
      const { email, password } = c.req.valid('json');
      const { token, user } = await auth.signIn(email, password);
      setCookie(c, SESSION_COOKIE, token, {
        path: SESSION_COOKIE_PATH,
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: SESSION_COOKIE_MAX_AGE,
      });
      return c.json(sessionBody(user), 200);
    })
    .openapi(meRoute, (c) => c.json(sessionBody(c.var.user), 200))
    .openapi(logoutRoute, async (c) => {
      const token = getCookie(c, SESSION_COOKIE);
      if (token) {
        await auth.signOut(token);
      }
      clearSessionCookie(c);
      return c.body(null, 204);
    });
};
