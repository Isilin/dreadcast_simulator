import { and, eq, gt, lt, sql } from 'drizzle-orm';

import type { AuthRepo } from './auth.repo.js';
import { toDbError, type Db } from '../../db/client.js';
import { firstOrNull } from '../../db/rows.js';
import { sessionInPrivate, usersInAuth } from '../../db/schema.js';

const metadataOf = (value: unknown): Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/** Database failures as DbError, like withAnon / withUser. */
const run = async <A>(work: () => Promise<A>): Promise<A> => {
  try {
    return await work();
  } catch (error) {
    throw toDbError(error);
  }
};

// The only queries outside withAnon / withUser: sign-in reads the password
// hashes and the sessions, which no API role may read.
export const makeAuthRepo = (db: Db): AuthRepo => ({
  findAccount: (email) =>
    run(async () => {
      const row = firstOrNull(
        await db
          .select({
            id: usersInAuth.id,
            email: usersInAuth.email,
            passwordHash: usersInAuth.encrypted_password,
            appMetadata: usersInAuth.raw_app_meta_data,
          })
          .from(usersInAuth)
          .where(sql`lower(${usersInAuth.email}) = lower(${email})`)
          .limit(1),
      );
      return row?.email
        ? {
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            appMetadata: metadataOf(row.appMetadata),
          }
        : null;
    }),

  createSession: (tokenHash, userId, expiresAt) =>
    run(async () => {
      await db.insert(sessionInPrivate).values({
        token_hash: tokenHash,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      });
    }),

  findSession: (tokenHash) =>
    run(async () => {
      const row = firstOrNull(
        await db
          .select({
            id: usersInAuth.id,
            email: usersInAuth.email,
            appMetadata: usersInAuth.raw_app_meta_data,
            expiresAt: sessionInPrivate.expires_at,
            lastSeenAt: sessionInPrivate.last_seen_at,
          })
          .from(sessionInPrivate)
          .innerJoin(usersInAuth, eq(usersInAuth.id, sessionInPrivate.user_id))
          .where(
            and(
              eq(sessionInPrivate.token_hash, tokenHash),
              gt(sessionInPrivate.expires_at, sql`now()`),
            ),
          ),
      );
      return row?.email
        ? {
            account: {
              id: row.id,
              email: row.email,
              appMetadata: metadataOf(row.appMetadata),
            },
            expiresAt: new Date(row.expiresAt),
            lastSeenAt: new Date(row.lastSeenAt),
          }
        : null;
    }),

  extendSession: (tokenHash, expiresAt) =>
    run(async () => {
      await db
        .update(sessionInPrivate)
        .set({ expires_at: expiresAt.toISOString(), last_seen_at: sql`now()` })
        .where(eq(sessionInPrivate.token_hash, tokenHash));
    }),

  deleteSession: (tokenHash) =>
    run(async () => {
      await db
        .delete(sessionInPrivate)
        .where(eq(sessionInPrivate.token_hash, tokenHash));
    }),

  deleteExpiredSessions: () =>
    run(async () => {
      await db
        .delete(sessionInPrivate)
        .where(lt(sessionInPrivate.expires_at, sql`now()`));
    }),
});
