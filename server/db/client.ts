import { sql } from 'drizzle-orm';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import type { PgDatabase } from 'drizzle-orm/pg-core';

import * as relations from './relations.js';
import * as tables from './schema.js';
import { DbError } from '../platform/db-error.js';

export const dbSchema = { ...tables, ...relations };
export type DbSchema = typeof dbSchema;

/**
 * A Drizzle database: node-postgres in production, PGlite in tests (raw
 * results have the same `rows`).
 */
export type Db = PgDatabase<NodePgQueryResultHKT, DbSchema>;

/** Transaction of withAnon / withUser: queries run under its role. */
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

/** Claims of the caller, as Supabase put them in its access tokens. */
export interface UserClaims {
  readonly userId: string;
  /** Read by the policies (`app_metadata.role = 'admin'`). */
  readonly appMetadata: Readonly<Record<string, unknown>>;
}

/**
 * Like PostgREST: the transaction runs as the anon or authenticated role
 * with the request claims, so row level security and auth.uid() apply. The
 * session time zone is UTC: timestamps keep their JSON form (columns.ts).
 */
const actAs = (role: 'anon' | 'authenticated', claims: object) => sql`
  select
    set_config('role', ${role}, true),
    set_config('request.jwt.claims', ${JSON.stringify(claims)}, true),
    set_config('TimeZone', 'UTC', true)
`;

interface PgErrorLike {
  readonly code?: unknown;
  readonly message: string;
}

const isPgErrorLike = (value: unknown): value is PgErrorLike =>
  value instanceof Error;

/**
 * Database failures as DbError, with the Postgres error code (23505...):
 * Drizzle wraps them, the driver error is the cause.
 */
export const toDbError = (error: unknown): DbError => {
  if (error instanceof DbError) {
    return error;
  }
  const cause =
    error instanceof Error && isPgErrorLike(error.cause) ? error.cause : error;
  if (isPgErrorLike(cause)) {
    return new DbError({
      code: typeof cause.code === 'string' ? cause.code : undefined,
      message: cause.message,
    });
  }
  return new DbError({ message: 'Unknown database error' });
};

const runAs = async <A>(
  db: Db,
  role: 'anon' | 'authenticated',
  claims: object,
  work: (tx: Tx) => Promise<A>,
): Promise<A> => {
  try {
    return await db.transaction(async (tx) => {
      await tx.execute(actAs(role, claims));
      return work(tx);
    });
  } catch (error) {
    throw toDbError(error);
  }
};

/** Runs `work` as a visitor (role anon). */
export const withAnon = <A>(db: Db, work: (tx: Tx) => Promise<A>) =>
  runAs(db, 'anon', { role: 'anon' }, work);

/** Runs `work` as the signed-in user (role authenticated, auth.uid()). */
export const withUser = <A>(
  db: Db,
  { userId, appMetadata }: UserClaims,
  work: (tx: Tx) => Promise<A>,
) =>
  runAs(
    db,
    'authenticated',
    { sub: userId, role: 'authenticated', app_metadata: appMetadata },
    work,
  );
