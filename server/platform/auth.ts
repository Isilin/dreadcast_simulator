import type { Context } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { unauthorized } from './http-errors.js';

/** Cookie of the sign-in session (HttpOnly, sent to /api only). */
export const SESSION_COOKIE = 'dc_session';
export const SESSION_COOKIE_PATH = '/api';
/**
 * The longest lifetime browsers keep (400 days): the database decides when
 * a session ends (30 days, extended while used).
 */
export const SESSION_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

/**
 * Signed-in caller. Its queries run under its identity (row level security,
 * see server/db/client.ts).
 */
export interface User {
  readonly userId: string;
  readonly email: string;
  /** Account metadata set by admins (`role: 'admin'`), read by policies. */
  readonly appMetadata: Readonly<Record<string, unknown>>;
}

/**
 * User of a session token: null when the token is not a live session;
 * throws (500) when the check itself fails.
 */
export type ResolveUser = (sessionToken: string) => Promise<User | null>;

export interface UserVariables {
  user: User;
}

export interface MaybeUserVariables {
  /** null for guests (no session cookie, or an expired one). */
  maybeUser: User | null;
}

const NOT_AUTHENTICATED = 'Utilisateur non authentifie.';
const SESSION_EXPIRED = 'Session expirée : reconnectez-vous.';

/** Removes the cookie of a dead session (the next requests skip it). */
export const clearSessionCookie = (c: Context) => {
  deleteCookie(c, SESSION_COOKIE, {
    path: SESSION_COOKIE_PATH,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  });
};

// Cookies are SameSite=Lax and every write takes a JSON body or a DELETE:
// a cross-site form cannot send the cookie, and a cross-site fetch needs a
// CORS preflight this API never grants. No CSRF token needed.
export const makeAuthMiddlewares = (resolveUser: ResolveUser) => ({
  /** Requires a live session cookie (401 otherwise). */
  requireUser: createMiddleware<{ Variables: UserVariables }>(
    async (c, next) => {
      const token = getCookie(c, SESSION_COOKIE);
      if (!token) {
        throw unauthorized(NOT_AUTHENTICATED);
      }
      const user = await resolveUser(token);
      if (!user) {
        clearSessionCookie(c);
        throw unauthorized(SESSION_EXPIRED);
      }
      c.set('user', user);
      await next();
    },
  ),

  /** Guests allowed: no cookie, or a dead session, reads as a guest. */
  optionalUser: createMiddleware<{ Variables: MaybeUserVariables }>(
    async (c, next) => {
      const token = getCookie(c, SESSION_COOKIE);
      const user = token ? await resolveUser(token) : null;
      if (token && !user) {
        clearSessionCookie(c);
      }
      c.set('maybeUser', user);
      await next();
    },
  ),
});

export type AuthMiddlewares = ReturnType<typeof makeAuthMiddlewares>;
