import { createRoute } from '@hono/zod-openapi';

import type { ProfileRepo } from './profile.repo.js';
import { Profile, PseudoPayload } from './profile.schema.js';
import type { AuthMiddlewares, User } from '../../platform/auth.js';
import { noStore } from '../../platform/cache.js';
import {
  mapDbError,
  toInternalError,
  type DbError,
} from '../../platform/db-error.js';
import { errorResponses } from '../../platform/http-errors.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  middlewares,
  jsonBody,
  jsonContent,
} from '../../platform/router.js';
import { communityError } from '../community/community.errors.js';

/** Constraint violations of the user_profile insert. */
const toPseudoError = (error: DbError) => {
  if (error.code === '23505') {
    return communityError(
      error.message.includes('user_profile_pkey')
        ? 'PSEUDO_ALREADY_SET'
        : 'PSEUDO_TAKEN',
    );
  }
  if (error.code === '23514') {
    return communityError('INVALID_PSEUDO');
  }
  return toInternalError(error);
};

export const profileRoutes = (
  profiles: (user: User) => ProfileRepo,
  { requireUser }: AuthMiddlewares,
) => {
  const meRoute = createRoute({
    method: 'get',
    path: '/profile/me',
    tags: ['profile'],
    middleware: middlewares(noStore, requireUser),
    responses: {
      200: jsonContent(Profile, 'Profile of the signed-in user'),
      ...errorResponses(401, 500),
    },
  });

  const setPseudoRoute = createRoute({
    method: 'put',
    path: '/profile/me',
    tags: ['profile'],
    description: 'The pseudo is definitive: PUT only creates it.',
    middleware: middlewares(
      noStore,
      requireUser,
      invalidRequestAs(() => communityError('INVALID_PSEUDO')),
    ),
    request: { body: jsonBody(PseudoPayload) },
    responses: {
      201: jsonContent(Profile, 'Pseudo chosen'),
      ...errorResponses(401, 409, 422, 500),
    },
  });

  return featureRouter()
    .openapi(meRoute, async (c) =>
      c.json({ pseudo: await profiles(c.var.user).pseudo() }, 200),
    )
    .openapi(setPseudoRoute, async (c) => {
      const repo = profiles(c.var.user);
      if (await repo.pseudo()) {
        throw communityError('PSEUDO_ALREADY_SET');
      }

      const pseudo = await mapDbError(
        repo.createPseudo(c.req.valid('json').pseudo),
        toPseudoError,
      );
      return c.json({ pseudo }, 201);
    });
};
