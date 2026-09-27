import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { AuthGateway } from './auth.gateway.js';
import { DreadcastApi } from '../../api.contract.js';
import { NoStoreLive } from '../../platform/cache.js';

export const AuthHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'auth',
  (handlers) =>
    Effect.gen(function* () {
      const gateway = yield* AuthGateway;

      return handlers.handle('login', ({ payload }) =>
        gateway.signInWithPassword(payload.email, payload.password),
      );
    }),
).pipe(Layer.provide(NoStoreLive));
