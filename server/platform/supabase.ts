import {
  createClient,
  type PostgrestError,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type { ZodType } from 'zod';

import type { ResolveUser } from './auth.js';
import type { SupabaseConfig } from './config.js';
import type { Database } from './database.gen.js';
import { DbError } from './db-error.js';
import { internalError } from './http-errors.js';

export type { SupabaseClient };

/** Server-side clients never persist nor refresh a session. */
const SERVER_AUTH_OPTIONS = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
} as const;

export interface Supabase {
  readonly anon: () => SupabaseClient<Database>;
  readonly forUser: (accessToken: string) => SupabaseClient<Database>;
}

/**
 * Supabase clients. Both factories return a new client on each call: a client
 * keeps the session of signInWithPassword in memory, so sharing one between
 * requests could leak a user's token into another request.
 */
export const makeSupabase = ({ url, anonKey }: SupabaseConfig): Supabase => ({
  anon: () =>
    createClient<Database>(url, anonKey, { auth: SERVER_AUTH_OPTIONS }),
  forUser: (accessToken) =>
    createClient<Database>(url, anonKey, {
      auth: SERVER_AUTH_OPTIONS,
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }),
});

/** Resolves the Supabase user of an access token (RLS client included). */
export const makeResolveUser =
  (supabase: Supabase): ResolveUser =>
  async (accessToken) => {
    const client = supabase.forUser(accessToken);
    let result: Awaited<ReturnType<typeof client.auth.getUser>>;
    try {
      result = await client.auth.getUser();
    } catch (cause) {
      throw internalError(unknownMessage(cause));
    }
    const { data, error } = result;
    return error || !data.user
      ? null
      : { userId: data.user.id, supabase: client };
  };

interface PostgrestResult {
  data: unknown;
  error: PostgrestError | null;
}

type Success<R extends PostgrestResult> = Extract<R, { error: null }>;

const unknownMessage = (cause: unknown) =>
  cause instanceof Error ? cause.message : 'Unknown error';

/** Awaits a PostgREST query and throws its `error` as a DbError. */
const execute = async <R extends PostgrestResult>(
  query: PromiseLike<R>,
): Promise<Success<R>> => {
  let result: R;
  try {
    result = await query;
  } catch (cause) {
    throw new DbError({ message: unknownMessage(cause) });
  }

  if (result.error) {
    throw new DbError({
      code: result.error.code,
      message: result.error.message,
    });
  }
  // Without error, supabase-js types the result as a success.
  return result as Success<R>;
};

/** Runs a PostgREST query and returns its data. */
export const runQuery = async <R extends PostgrestResult>(
  query: PromiseLike<R>,
): Promise<Success<R>['data']> => (await execute(query)).data;

/** Like runQuery, also returning the `count` requested on the select. */
export const runCountedQuery = async <
  R extends PostgrestResult & { count: number | null },
>(
  query: PromiseLike<R>,
): Promise<{ data: Success<R>['data']; count: number | null }> => {
  const result = await execute(query);
  return { data: result.data, count: result.count };
};

/**
 * Validates rows whose generated types are loose (RPC results, JSON columns).
 * A mismatch is a database error: 500, like any unexpected row.
 */
export const decodeRows =
  <A>(schema: ZodType<A>) =>
  (rows: unknown): A => {
    const result = schema.safeParse(rows);
    if (!result.success) {
      throw new DbError({ message: `Unexpected row: ${result.error.message}` });
    }
    return result.data;
  };
