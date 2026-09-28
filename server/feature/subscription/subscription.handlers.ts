import { Effect, Layer } from 'effect';
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder';

import { SubscriptionRepo } from './subscription.repo.js';
import { buildSubscriptionDateRange } from './subscription.rules.js';
import { DreadcastApi } from '../../api.contract.js';
import { NoStoreLive } from '../../platform/cache.js';
import { toInternalError } from '../../platform/db-error.js';
import { BadRequest } from '../../platform/http-errors.js';

export const SubscriptionHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'subscriptions',
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* SubscriptionRepo;

      return handlers
        .handle('plans', () =>
          repo.activePlans.pipe(Effect.mapError(toInternalError)),
        )
        .handle('listMine', () =>
          repo.listMine.pipe(Effect.mapError(toInternalError)),
        )
        .handle('create', ({ payload }) =>
          Effect.gen(function* () {
            const plan = yield* repo
              .activePlan(payload.planCode)
              .pipe(
                Effect.mapError(
                  () =>
                    new BadRequest({ error: 'Plan abonnement introuvable.' }),
                ),
              );

            return yield* repo
              .create(
                plan,
                buildSubscriptionDateRange(plan.duration_ingame_years),
              )
              .pipe(Effect.mapError(toInternalError));
          }),
        );
    }),
).pipe(Layer.provide(NoStoreLive));
