import { createMiddleware } from 'hono/factory';

import { unauthorized } from './http-errors.js';

/**
 * Signed-in caller. Its queries run under its identity (row level security,
 * see server/db/client.ts).
 */
export interface User {
  readonly userId: string;
  /** Account metadata set by admins (`role: 'admin'`), read by policies. */
  readonly appMetadata: Readonly<Record<string, unknown>>;
}

/**
 * User of a session access token: null when the token is not a valid
 * session; throws (500) when the check itself fails.
 */
export type ResolveUser = (accessToken: string) => Promise<User | null>;

export interface UserVariables {
  user: User;
}

export interface MaybeUserVariables {
  /** null for guests (no Authorization header). */
  maybeUser: User | null;
}

const NOT_AUTHENTICATED = 'Utilisateur non authentifie.';
const INVALID_TOKEN = "Jeton d'authentification invalide.";

/**
 * Credential of `Authorization: Bearer <token>`: case-insensitive scheme,
 * one or more spaces (RFC 9110), undefined otherwise.
 */
const bearerCredential = (authorization: string | undefined) => {
  const match = authorization?.match(/^bearer +([^ ].*)$/i);
  return match?.[1];
};

/** Legacy parsing of the optional header: `<scheme> <token>`. */
const legacyBearer = (authorization: string) => {
  const [scheme, token] = authorization.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
};

const resolveOrReject = async (
  resolveUser: ResolveUser,
  accessToken: string,
) => {
  const user = await resolveUser(accessToken);
  if (!user) {
    throw unauthorized(NOT_AUTHENTICATED);
  }
  return user;
};

export const makeAuthMiddlewares = (resolveUser: ResolveUser) => ({
  /** Requires `Authorization: Bearer <Supabase access token>`. */
  requireUser: createMiddleware<{ Variables: UserVariables }>(
    async (c, next) => {
      const authorization = c.req.header('authorization');
      const accessToken = bearerCredential(authorization);
      if (!accessToken) {
        throw unauthorized(authorization ? INVALID_TOKEN : NOT_AUTHENTICATED);
      }

      c.set('user', await resolveOrReject(resolveUser, accessToken));
      await next();
    },
  ),

  /**
   * Guest access without Authorization; a header, when sent, must be a valid
   * session (401 otherwise, as for requireUser).
   */
  optionalUser: createMiddleware<{ Variables: MaybeUserVariables }>(
    async (c, next) => {
      const authorization = c.req.header('authorization');
      if (!authorization) {
        c.set('maybeUser', null);
        await next();
        return;
      }

      const accessToken = legacyBearer(authorization);
      if (!accessToken) {
        throw unauthorized(INVALID_TOKEN);
      }

      c.set('maybeUser', await resolveOrReject(resolveUser, accessToken));
      await next();
    },
  ),
});

export type AuthMiddlewares = ReturnType<typeof makeAuthMiddlewares>;
