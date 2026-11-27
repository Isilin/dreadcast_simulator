import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { ResolveUser } from './auth.js';
import type { SupabaseConfig } from './config.js';
import { internalError } from './http-errors.js';

// Supabase Auth only (sign-in, session check): data goes through Postgres
// (server/db). Replaced by our own sessions in a later change.

/** Server-side clients never persist nor refresh a session. */
const SERVER_AUTH_OPTIONS = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
} as const;

export interface SupabaseAuth {
  /**
   * New client on each call: a client keeps the session of
   * signInWithPassword in memory, sharing one between requests could leak a
   * user's token into another request.
   */
  readonly client: (accessToken?: string) => SupabaseClient;
}

export const makeSupabaseAuth = ({
  url,
  anonKey,
}: SupabaseConfig): SupabaseAuth => ({
  client: (accessToken) =>
    createClient(url, anonKey, {
      auth: SERVER_AUTH_OPTIONS,
      ...(accessToken
        ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        : {}),
    }),
});

const unknownMessage = (cause: unknown) =>
  cause instanceof Error ? cause.message : 'Unknown error';

/** Resolves the Supabase user of an access token. */
export const makeResolveUser =
  (auth: SupabaseAuth): ResolveUser =>
  async (accessToken) => {
    const client = auth.client(accessToken);
    let result: Awaited<ReturnType<typeof client.auth.getUser>>;
    try {
      result = await client.auth.getUser();
    } catch (cause) {
      throw internalError(unknownMessage(cause));
    }
    const { data, error } = result;
    return error || !data.user
      ? null
      : { userId: data.user.id, appMetadata: data.user.app_metadata };
  };
