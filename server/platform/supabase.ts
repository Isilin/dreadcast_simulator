import {
  createClient,
  type PostgrestError,
  type SupabaseClient as BaseSupabaseClient,
} from '@supabase/supabase-js';
import { Context, Effect, Layer, Schema } from 'effect';

import { SupabaseConfig } from './config.js';
import type { Database } from './database.gen.js';
import { DbError } from './db-error.js';

export type SupabaseClient = BaseSupabaseClient<Database>;

/** Server-side clients never persist nor refresh a session. */
const SERVER_AUTH_OPTIONS = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
} as const;

/**
 * Supabase clients. Both factories return a new client on each call: a client
 * keeps the session of signInWithPassword in memory, so sharing one between
 * requests could leak a user's token into another request.
 */
export class Supabase extends Context.Service<
  Supabase,
  {
    readonly anon: () => SupabaseClient;
    readonly forUser: (accessToken: string) => SupabaseClient;
  }
>()('server/Supabase') {
  static readonly layer = Layer.effect(
    Supabase,
    Effect.gen(function* () {
      const { url, anonKey } = yield* SupabaseConfig;

      return {
        anon: () =>
          createClient<Database>(url, anonKey, { auth: SERVER_AUTH_OPTIONS }),
        forUser: (accessToken: string) =>
          createClient<Database>(url, anonKey, {
            auth: SERVER_AUTH_OPTIONS,
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
          }),
      };
    }),
  );
}

interface PostgrestResult {
  data: unknown;
  error: PostgrestError | null;
}

type SuccessData<R extends PostgrestResult> = Extract<
  R,
  { error: null }
>['data'];

/** Awaits a PostgREST query and moves its `error` to the failure channel. */
const execute = <R extends PostgrestResult>(
  query: PromiseLike<R>,
): Effect.Effect<Extract<R, { error: null }>, DbError> =>
  Effect.tryPromise({
    try: () => Promise.resolve(query),
    catch: (cause) =>
      new DbError({
        message: cause instanceof Error ? cause.message : 'Unknown error',
      }),
  }).pipe(
    Effect.flatMap((result) =>
      result.error
        ? Effect.fail(
            new DbError({
              code: result.error.code,
              message: result.error.message,
            }),
          )
        : // Without error, supabase-js types the result as a success.
          Effect.succeed(result as Extract<R, { error: null }>),
    ),
  );

/** Runs a PostgREST query and returns its data. */
export const runQuery = <R extends PostgrestResult>(
  query: PromiseLike<R>,
): Effect.Effect<SuccessData<R>, DbError> =>
  Effect.map(execute(query), (result) => result.data);

/** Like runQuery, also returning the `count` requested on the select. */
export const runCountedQuery = <
  R extends PostgrestResult & { count: number | null },
>(
  query: PromiseLike<R>,
): Effect.Effect<{ data: SuccessData<R>; count: number | null }, DbError> =>
  Effect.map(execute(query), (result) => ({
    data: result.data,
    count: result.count,
  }));

/**
 * Validates rows whose generated types are loose (RPC results, JSON columns).
 * A mismatch is a database error: 500, like any unexpected row.
 */
export const decodeRows =
  <A>(schema: Schema.Codec<A, unknown>) =>
  (rows: unknown): Effect.Effect<A, DbError> =>
    Schema.decodeUnknownEffect(schema)(rows).pipe(
      Effect.mapError(
        (error) => new DbError({ message: `Unexpected row: ${error.message}` }),
      ),
    );
