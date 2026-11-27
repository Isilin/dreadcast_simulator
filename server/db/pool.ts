import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { dbSchema, type Db } from './client.js';
import { migrate } from './migrate.js';

/**
 * node-postgres waits forever for an unreachable host by default: the health
 * check must fail fast instead.
 */
const CONNECTION_TIMEOUT_MS = 5_000;

/** Applies the pending migrations of `dir` on a dedicated connection. */
export const migrateDatabase = async (
  url: string,
  dir: string,
): Promise<ReadonlyArray<string>> => {
  const client = new pg.Client({
    connectionString: url,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  });
  await client.connect();
  try {
    return await migrate(
      {
        query: (text, params) => client.query(text, params as Array<unknown>),
        exec: (text) => client.query(text),
      },
      dir,
    );
  } finally {
    await client.end();
  }
};

export interface NodeDb {
  readonly db: Db;
  readonly pool: pg.Pool;
}

/** Database of the running server (node-postgres pool). */
export const makeNodeDb = (url: string, max = 10): NodeDb => {
  const pool = new pg.Pool({
    connectionString: url,
    max,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  });
  // An idle client that loses its connection must not crash the process.
  pool.on('error', (error) => {
    // eslint-disable-next-line no-console -- server log
    console.error('Idle database client error:', error.message);
  });
  return { db: drizzle(pool, { schema: dbSchema }), pool };
};
