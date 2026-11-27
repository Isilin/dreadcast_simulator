import type { ResolveUser, User } from '../../platform/auth.js';

/** A new session: its cookie token (never stored) and its user. */
export interface SignedIn {
  readonly token: string;
  readonly user: User;
}

/**
 * Password sign-in and cookie sessions, behind an interface so routes can be
 * tested without the database. Throws HttpError: 401 on wrong credentials,
 * 429 after too many failures.
 */
export interface AuthService {
  readonly signIn: (email: string, password: string) => Promise<SignedIn>;
  /** User of a live session; refreshes its expiry now and then. */
  readonly resolve: ResolveUser;
  readonly signOut: (token: string) => Promise<void>;
}

/** 30 days, extended at most once a day while the user comes back. */
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
