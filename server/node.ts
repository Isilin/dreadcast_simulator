import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createApp } from './app.js';
import { migrateDatabase } from './db/pool.js';
import { makeLiveDeps } from './live.js';
import { readDatabaseConfig } from './platform/config.js';

/**
 * Node server of the container (forge): the API under /api plus the built
 * front (dist/) with an SPA fallback. Locally, `yarn dev:api` runs it on
 * port 3001 for the Vite proxy (API_PROXY_TARGET=http://localhost:3001).
 * Warning: .env.local targets the production database.
 */
const PORT = Number(process.env.PORT ?? 3000);
const STATIC_ROOT = process.env.STATIC_ROOT ?? './dist';

// DB_MIGRATE=1 applies the pending migrations before serving: only on our own
// Postgres (forge-pg). The Supabase database is refused by the migrator.
if (process.env.DB_MIGRATE === '1') {
  const applied = await migrateDatabase(
    readDatabaseConfig().url,
    process.env.MIGRATIONS_DIR ?? 'server/db/migrations',
  );
  // eslint-disable-next-line no-console -- server startup log
  console.log(
    applied.length > 0
      ? `Migrations applied: ${applied.join(', ')}`
      : 'Database up to date',
  );
}

const IMMUTABLE = 'public, max-age=31536000, immutable';
const REVALIDATE = 'no-cache';

/** index.html of the build, read once; null when the front is not built. */
const indexHtml = await readFile(join(STATIC_ROOT, 'index.html'), 'utf8').catch(
  () => null,
);

const app = new Hono();

app.route('/', createApp(makeLiveDeps()));

// Same redirect as vercel.json: shared links open the app.
app.get('/shared/:id', (c) => c.redirect('/', 307));

app.use(
  '*',
  serveStatic({
    root: STATIC_ROOT,
    onFound: (_path, c) => {
      // Hashed file names under /assets never change; the rest revalidates.
      c.header(
        'Cache-Control',
        c.req.path.startsWith('/assets/') ? IMMUTABLE : REVALIDATE,
      );
    },
  }),
);

/** Paths that must not fall back to index.html. */
const NO_FALLBACK = /^\/(api|assets)\//;

// SPA fallback: client-side routes get index.html. Unknown API paths and
// missing assets (an old chunk after a deploy) answer 404, not HTML.
app.get('*', (c) => {
  if (NO_FALLBACK.test(c.req.path) || indexHtml === null) {
    return c.notFound();
  }
  c.header('Cache-Control', REVALIDATE);
  return c.html(indexHtml);
});

const server = serve({ fetch: app.fetch, port: PORT }, ({ port }) => {
  // eslint-disable-next-line no-console -- server startup log
  console.log(`Dreadcast Simulator listening on port ${port}`);
});

// Coolify stops the container with SIGTERM: finish the requests in flight.
const shutdown = () => {
  server.close(() => process.exit(0));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
