import { Context, Effect, Layer } from 'effect';

import { CurrentUser } from '../../platform/auth.js';
import type { DbError } from '../../platform/db-error.js';
import { runQuery } from '../../platform/supabase.js';

export class ProfileRepo extends Context.Service<
  ProfileRepo,
  {
    /** Pseudo of the current user, null until chosen. */
    readonly pseudo: Effect.Effect<string | null, DbError, CurrentUser>;
    /** Fails with 23505 (already set or taken) or 23514 (invalid). */
    readonly createPseudo: (
      pseudo: string,
    ) => Effect.Effect<string, DbError, CurrentUser>;
  }
>()('server/ProfileRepo') {
  static readonly layer = Layer.succeed(ProfileRepo, {
    pseudo: CurrentUser.use(({ supabase, userId }) =>
      runQuery(
        supabase
          .from('user_profile')
          .select('pseudo')
          .eq('user_id', userId)
          .maybeSingle(),
      ).pipe(Effect.map((row) => row?.pseudo ?? null)),
    ),
    createPseudo: (pseudo) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('user_profile')
            .insert({ user_id: userId, pseudo })
            .select('pseudo')
            .single(),
        ).pipe(Effect.map((row) => row.pseudo)),
      ),
  });
}
