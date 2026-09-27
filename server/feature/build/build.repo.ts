import { Context, Effect, Layer } from 'effect';

import type { BuildRow } from './build.rules.js';
import { CurrentUser } from '../../platform/auth.js';
import type { Json } from '../../platform/database.gen.js';
import type { DbError } from '../../platform/db-error.js';
import { runQuery } from '../../platform/supabase.js';

const BUILD_SELECT = 'id, snapshot, saved_at';

/** Builds of the current user (RLS applies through their session). */
export class BuildRepo extends Context.Service<
  BuildRepo,
  {
    /** Ordered by creation: the index is the slot. */
    readonly listOrdered: Effect.Effect<
      ReadonlyArray<BuildRow>,
      DbError,
      CurrentUser
    >;
    readonly update: (
      id: string,
      snapshot: Json,
      savedAt: string,
    ) => Effect.Effect<BuildRow, DbError, CurrentUser>;
    readonly insert: (
      snapshot: Json,
      savedAt: string,
    ) => Effect.Effect<BuildRow, DbError, CurrentUser>;
    /** Ids actually deleted: empty when row level security refused it. */
    readonly remove: (
      id: string,
    ) => Effect.Effect<ReadonlyArray<string>, DbError, CurrentUser>;
  }
>()('server/BuildRepo') {
  static readonly layer = Layer.succeed(BuildRepo, {
    listOrdered: CurrentUser.use(({ supabase, userId }) =>
      runQuery(
        supabase
          .from('build')
          .select(BUILD_SELECT)
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .order('id', { ascending: true }),
      ),
    ),
    update: (id, snapshot, savedAt) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('build')
            .update({ snapshot, saved_at: savedAt })
            .eq('id', id)
            .eq('user_id', userId)
            .select(BUILD_SELECT)
            .single(),
        ),
      ),
    insert: (snapshot, savedAt) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('build')
            .insert({ user_id: userId, snapshot, saved_at: savedAt })
            .select(BUILD_SELECT)
            .single(),
        ),
      ),
    remove: (id) =>
      CurrentUser.use(({ supabase, userId }) =>
        runQuery(
          supabase
            .from('build')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)
            .select('id'),
        ).pipe(Effect.map((rows) => rows.map((row) => row.id))),
      ),
  });
}
