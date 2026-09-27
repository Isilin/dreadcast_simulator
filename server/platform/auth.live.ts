import { Effect, Layer, Option, Redacted } from 'effect';
import { HttpServerRequest } from 'effect/unstable/http';

import {
  Authentication,
  CurrentUser,
  MaybeCurrentUser,
  OptionalAuthentication,
} from './auth.js';
import { InternalError, Unauthorized } from './http-errors.js';
import { Supabase } from './supabase.js';

const NOT_AUTHENTICATED = 'Utilisateur non authentifie.';
const INVALID_TOKEN = "Jeton d'authentification invalide.";

/** Resolves the Supabase user of an access token. */
const makeResolveUser =
  (supabase: Supabase['Service']) => (accessToken: string) =>
    Effect.gen(function* () {
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

      return { userId: data.user.id, supabase: client };
    });

/** Legacy parsing of `Authorization: Bearer <token>`. */
const parseBearer = (authorization: string) => {
  const [scheme, token] = authorization.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
};

export const AuthenticationLive = Layer.effect(
  Authentication,
  Effect.gen(function* () {
    const resolveUser = makeResolveUser(yield* Supabase);

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

          const user = yield* resolveUser(accessToken);
          return yield* Effect.provideService(httpEffect, CurrentUser, user);
        }),
    };
  }),
);

export const OptionalAuthenticationLive = Layer.effect(
  OptionalAuthentication,
  Effect.gen(function* () {
    const resolveUser = makeResolveUser(yield* Supabase);

    return (httpEffect) =>
      Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest;
        const authorization = request.headers.authorization;
        if (!authorization) {
          return yield* Effect.provideService(
            httpEffect,
            MaybeCurrentUser,
            Option.none(),
          );
        }

        const accessToken = parseBearer(authorization);
        if (!accessToken) {
          return yield* new Unauthorized({ error: INVALID_TOKEN });
        }

        const user = yield* resolveUser(accessToken);
        return yield* Effect.provideService(
          httpEffect,
          MaybeCurrentUser,
          Option.some(user),
        );
      });
  }),
);
