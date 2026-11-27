/* eslint-disable no-console -- CLI output */
import { runAdminCommand } from './admin.commands.js';
import { makeNodeDb, type NodeDb } from '../db/pool.js';
import { readDatabaseConfig } from '../platform/config.js';

/**
 * Admin CLI of the container (Coolify terminal):
 *   node dist-server/admin.js user:create someone@example.com
 * Uses the DATABASE_URL of the app. Run `node dist-server/admin.js` for the
 * commands.
 */
let nodeDb: NodeDb | undefined;
try {
  nodeDb = makeNodeDb(readDatabaseConfig().url, 1);
  for (const line of await runAdminCommand(nodeDb.db, process.argv.slice(2))) {
    console.log(line);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await nodeDb?.pool.end();
}
