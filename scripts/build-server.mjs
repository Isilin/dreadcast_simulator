/**
 * Bundles the Node server (server/node.ts) and the admin CLI
 * (server/admin/admin.ts) with their dependencies, so the Docker image needs
 * no node_modules.
 *
 * Usage: yarn build:server  ->  dist-server/index.js, dist-server/admin.js
 */
import { build } from 'esbuild';

await build({
  entryPoints: { index: 'server/node.ts', admin: 'server/admin/admin.ts' },
  outdir: 'dist-server',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node26',
  sourcemap: true,
  legalComments: 'none',
  // CommonJS dependencies bundled into ESM still call require().
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  logLevel: 'info',
});
