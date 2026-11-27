import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * One connection: `query` without parameters uses the simple query protocol,
 * which runs a whole migration file (functions and DO blocks included).
 * node-postgres clients and PGlite both fit.
 */
export interface MigrationConnection {
  readonly query: (
    text: string,
    params?: ReadonlyArray<unknown>,
  ) => Promise<{ rows: ReadonlyArray<Record<string, unknown>> }>;
  readonly exec: (text: string) => Promise<unknown>;
}

interface JournalEntry {
  readonly tag: string;
  readonly when: number;
}

/** Arbitrary key: one migration run at a time. */
const LOCK_KEY = 4_727_201;

// Same table as Drizzle's migrator: drizzle-kit and drizzle-orm see the same
// history.
const HISTORY_DDL = `
  CREATE SCHEMA IF NOT EXISTS drizzle;
  CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
    id SERIAL PRIMARY KEY,
    hash TEXT NOT NULL,
    created_at BIGINT
  );
`;

const readJournal = async (
  dir: string,
): Promise<ReadonlyArray<JournalEntry>> => {
  const journal = JSON.parse(
    await readFile(join(dir, 'meta', '_journal.json'), 'utf8'),
  ) as { entries: ReadonlyArray<JournalEntry> };
  return journal.entries;
};

/**
 * Refuses a database that already has tables but no migration history: the
 * Supabase database (until the switch) must never receive the baseline.
 */
const assertManaged = async (connection: MigrationConnection) => {
  const { rows } = await connection.query(`
    SELECT
      to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS has_history,
      EXISTS (
        SELECT FROM information_schema.tables WHERE table_schema = 'public'
      ) AS has_tables
  `);
  const [state] = rows;
  if (!state?.has_history && state?.has_tables) {
    throw new Error(
      'Refusing to migrate: tables exist in public without migration history.',
    );
  }
};

/**
 * Applies the migrations of `dir` (drizzle-kit layout) that are newer than
 * the last applied one, all in one transaction. Returns the applied tags.
 */
export const migrate = async (
  connection: MigrationConnection,
  dir: string,
): Promise<ReadonlyArray<string>> => {
  const entries = await readJournal(dir);
  await connection.exec('BEGIN');
  try {
    await connection.query('SELECT pg_advisory_xact_lock($1)', [LOCK_KEY]);
    await assertManaged(connection);
    await connection.exec(HISTORY_DDL);

    const { rows } = await connection.query(
      'SELECT max(created_at)::text AS last FROM drizzle.__drizzle_migrations',
    );
    const last = Number(rows[0]?.last ?? 0);

    const applied: Array<string> = [];
    for (const entry of entries.filter(({ when }) => when > last)) {
      const text = await readFile(join(dir, `${entry.tag}.sql`), 'utf8');
      await connection.exec(text);
      await connection.query(
        'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)',
        [createHash('sha256').update(text).digest('hex'), entry.when],
      );
      applied.push(entry.tag);
    }

    await connection.exec('COMMIT');
    return applied;
  } catch (error) {
    await connection.exec('ROLLBACK');
    throw error;
  }
};
