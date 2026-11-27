/** An account of auth.users, as needed to sign in. */
export interface Account {
  readonly id: string;
  readonly email: string;
  /** bcrypt hash; null for an account without password. */
  readonly passwordHash: string | null;
  readonly appMetadata: Readonly<Record<string, unknown>>;
}

export interface StoredSession {
  readonly account: Omit<Account, 'passwordHash'>;
  readonly expiresAt: Date;
  readonly lastSeenAt: Date;
}

/**
 * Accounts and sessions. Run as the server's own role: sessions are not
 * readable by anon / authenticated.
 */
export interface AuthRepo {
  /** Case-insensitive email lookup. */
  readonly findAccount: (email: string) => Promise<Account | null>;
  readonly createSession: (
    tokenHash: string,
    userId: string,
    expiresAt: Date,
  ) => Promise<void>;
  /** Live sessions only (not expired). */
  readonly findSession: (tokenHash: string) => Promise<StoredSession | null>;
  readonly extendSession: (tokenHash: string, expiresAt: Date) => Promise<void>;
  readonly deleteSession: (tokenHash: string) => Promise<void>;
  /** Removes the expired sessions of every user. */
  readonly deleteExpiredSessions: () => Promise<void>;
}
