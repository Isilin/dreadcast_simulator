import { Effect, Layer, Redacted } from 'effect';
import { HttpServerRequest } from 'effect/unstable/http';

import { Authentication, CurrentUser } from './auth.js';
import { InternalError, Unauthorized } from './http-errors.js';
import { Supabase } from './supabase.js';

const NOT_AUTHENTICATED = 'Utilisateur non authentifie.';
const INVALID_TOKEN = "Jeton d'authentification invalide.";

export const AuthenticationLive = Layer.effect(
  Authentication,
  Effect.gen(function* () {
    const supabase = yield* Supabase;

    return {
      bearer: (httpEffect, { credential }) =>
        Effect.gen(function* () {
          const accessToken = Redacted.value(credential);
          if (!accessToken) {
            // Empty credential: no header at all, or not a bearer token.
            const request = yield* HttpServerRequest.HttpServerRequest;
            return yield* new Unauthorized({
              error: request.headers.authorization
                ? INVALID_TOKEN
                : NOT_AUTHENTICATED,
            });
          }

          const client = supabase.forUser(accessToken);
          const { data, error } = yield* Effect.tryPromise({
            try: () => client.auth.getUser(),
            catch: (cause) =>
              new InternalError({
                error: cause instanceof Error ? cause.message : 'Unknown error',
              }),
          });

          if (error || !data.user) {
            return yield* new Unauthorized({ error: NOT_AUTHENTICATED });
          }

          return yield* Effect.provideService(httpEffect, CurrentUser, {
            userId: data.user.id,
            supabase: client,
          });
        }),
    };
  }),
);
