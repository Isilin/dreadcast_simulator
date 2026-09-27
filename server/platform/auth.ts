import { Context } from 'effect';
import { HttpApiMiddleware, HttpApiSecurity } from 'effect/unstable/httpapi';

import { InternalError, Unauthorized } from './http-errors.js';
import type { SupabaseClient } from './supabase.js';

/** Signed-in caller, with a Supabase client acting under its session (RLS). */
export class CurrentUser extends Context.Service<
  CurrentUser,
  {
    readonly userId: string;
    readonly supabase: SupabaseClient;
  }
>()('api/CurrentUser') {}

/**
 * Requires `Authorization: Bearer <Supabase access token>`. Implemented by
 * AuthenticationLive (auth.live.ts) to keep contracts free of Supabase.
 */
export class Authentication extends HttpApiMiddleware.Service<
  Authentication,
  { provides: CurrentUser }
>()('api/Authentication', {
  error: [Unauthorized, InternalError],
  security: { bearer: HttpApiSecurity.bearer },
}) {}
