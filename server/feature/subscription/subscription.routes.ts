import { createRoute, z } from '@hono/zod-openapi';

import type { SubscriptionRepo } from './subscription.repo.js';
import { buildSubscriptionDateRange } from './subscription.rules.js';
import {
  CreateSubscriptionPayload,
  Subscription,
  SubscriptionPlan,
} from './subscription.schema.js';
import type { AuthMiddlewares, User } from '../../platform/auth.js';
import { noStore } from '../../platform/cache.js';
import { mapDbError } from '../../platform/db-error.js';
import { badRequest, errorResponses } from '../../platform/http-errors.js';
import { invalidRequestAs } from '../../platform/request-validation.js';
import {
  featureRouter,
  jsonBody,
  jsonContent,
  middlewares,
} from '../../platform/router.js';

export const subscriptionRoutes = (
  subscriptions: (user: User) => SubscriptionRepo,
  { requireUser }: AuthMiddlewares,
) => {
  const plansRoute = createRoute({
    method: 'get',
    path: '/subscription-plans',
    tags: ['subscriptions'],
    middleware: middlewares(noStore, requireUser),
    responses: {
      200: jsonContent(z.array(SubscriptionPlan), 'Active plans'),
      ...errorResponses(401, 500),
    },
  });

  const listMineRoute = createRoute({
    method: 'get',
    path: '/subscriptions',
    tags: ['subscriptions'],
    middleware: middlewares(noStore, requireUser),
    responses: {
      200: jsonContent(z.array(Subscription), 'Most recent first'),
      ...errorResponses(401, 500),
    },
  });

  const createSubscriptionRoute = createRoute({
    method: 'post',
    path: '/subscriptions',
    tags: ['subscriptions'],
    middleware: middlewares(
      noStore,
      requireUser,
      invalidRequestAs(() => badRequest('Payload abonnement invalide.')),
    ),
    request: { body: jsonBody(CreateSubscriptionPayload) },
    responses: {
      201: jsonContent(Subscription, 'Pending subscription'),
      ...errorResponses(400, 401, 500),
    },
  });

  return featureRouter()
    .openapi(plansRoute, async (c) =>
      c.json([...(await subscriptions(c.var.user).activePlans())], 200),
    )
    .openapi(listMineRoute, async (c) =>
      c.json([...(await subscriptions(c.var.user).listMine())], 200),
    )
    .openapi(createSubscriptionRoute, async (c) => {
      const repo = subscriptions(c.var.user);
      const plan = await mapDbError(
        repo.activePlan(c.req.valid('json').planCode),
        () => badRequest('Plan abonnement introuvable.'),
      );

      const subscription = await repo.create(
        plan,
        buildSubscriptionDateRange(plan.duration_ingame_years),
      );
      return c.json(subscription, 201);
    });
};
