import { Context, Effect, Layer } from 'effect';

import { InternalError, Unauthorized } from '../../platform/http-errors.js';
import { Supabase } from '../../platform/supabase.js';

export interface SessionTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/** Supabase Auth, behind a service so handlers can be tested without it. */
export class AuthGateway extends Context.Service<
  AuthGateway,
  {
    readonly signInWithPassword: (
      email: string,
      password: string,
    ) => Effect.Effect<SessionTokens, Unauthorized | InternalError>;
  }
>()('server/AuthGateway') {
  static readonly layer = Layer.effect(
    AuthGateway,
    Effect.gen(function* () {
      const supabase = yield* Supabase;

      return {
        signInWithPassword: (email, password) =>
          Effect.gen(function* () {
            // Fresh client: it keeps the new session in memory.
            const { data, error } = yield* Effect.tryPromise({
              try: () =>
                supabase.anon().auth.signInWithPassword({ email, password }),
              catch: (cause) =>
                new InternalError({
                  error:
                    cause instanceof Error
                      ? cause.message
                      : 'Erreur de connexion',
                }),
            });

            if (error || !data.session) {
              return yield* new Unauthorized({
                error: error?.message ?? 'Connexion refusée',
              });
            }

            return {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
            };
          }),
      };
    }),
  );
}
