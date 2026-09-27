import { Context, type Option } from 'effect';
import { HttpApiMiddleware, HttpApiSecurity } from 'effect/unstable/httpapi';

import { InternalError, Unauthorized } from './http-errors.js';
import type { SupabaseClient } from './supabase.js';

interface User {
  readonly userId: string;
  readonly supabase: SupabaseClient;
}

/** Signed-in caller, with a Supabase client acting under its session (RLS). */
export class CurrentUser extends Context.Service<CurrentUser, User>()(
  'api/CurrentUser',
) {}

/** Caller of an endpoint open to guests: none without Authorization. */
export class MaybeCurrentUser extends Context.Service<
  MaybeCurrentUser,
  Option.Option<User>
>()('api/MaybeCurrentUser') {}

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

/**
 * Guest access without Authorization; a header, when sent, must be a valid
 * session (401 otherwise, as for Authentication).
 */
export class OptionalAuthentication extends HttpApiMiddleware.Service<
  OptionalAuthentication,
  { provides: MaybeCurrentUser }
>()('api/OptionalAuthentication', {
  error: [Unauthorized, InternalError],
}) {}
