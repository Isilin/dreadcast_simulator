import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';

import type { Account, AuthRepo } from './auth.repo.js';
import { SESSION_TTL_SECONDS, type AuthService } from './auth.service.js';
import { tooManyRequests, unauthorized } from '../../platform/http-errors.js';
import {
  makeFailureLimiter,
  type FailureLimiter,
} from '../../platform/rate-limit.js';

const INVALID_CREDENTIALS = 'Identifiants invalides.';
const TOO_MANY_ATTEMPTS =
  'Trop de tentatives de connexion : réessayez dans quelques minutes.';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compared when the account is unknown: same cost as a real check, so the
 * response time does not reveal which emails exist (bcrypt of a dummy
 * string, cost 10 like the stored hashes).
 */
const DUMMY_HASH =
  '$2b$10$bpEEVbl1QclvlKytFucnP.ChKPaI3BNHWn14WKKOVbilpLKHiNGnK';

/** sha256 of a session token: the database never sees the token itself. */
export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

const toUser = (account: Omit<Account, 'passwordHash'>) => ({
  userId: account.id,
  email: account.email,
  appMetadata: account.appMetadata,
});

export const makeAuthService = (
  repo: AuthRepo,
  {
    now = () => new Date(),
    limiter = makeFailureLimiter({ max: 10, windowMs: 15 * 60 * 1000 }),
  }: { now?: () => Date; limiter?: FailureLimiter } = {},
): AuthService => {
  const expiryFrom = (date: Date) =>
    new Date(date.getTime() + SESSION_TTL_SECONDS * 1000);

  return {
    signIn: async (email, password) => {
      const key = email.toLowerCase();
      if (limiter.isBlocked(key)) {
        throw tooManyRequests(TOO_MANY_ATTEMPTS);
      }

      const account = await repo.findAccount(email);
      const matches = await bcrypt.compare(
        password,
        account?.passwordHash ?? DUMMY_HASH,
      );
      if (!account?.passwordHash || !matches) {
        limiter.recordFailure(key);
        throw unauthorized(INVALID_CREDENTIALS);
      }
      limiter.reset(key);

      await repo.deleteExpiredSessions();
      const token = randomBytes(32).toString('base64url');
      await repo.createSession(hashToken(token), account.id, expiryFrom(now()));
      return { token, user: toUser(account) };
    },

    resolve: async (token) => {
      const tokenHash = hashToken(token);
      const session = await repo.findSession(tokenHash);
      if (!session) {
        return null;
      }
      const current = now();
      if (current.getTime() - session.lastSeenAt.getTime() >= DAY_MS) {
        await repo.extendSession(tokenHash, expiryFrom(current));
      }
      return toUser(session.account);
    },

    signOut: (token) => repo.deleteSession(hashToken(token)),
  };
};
