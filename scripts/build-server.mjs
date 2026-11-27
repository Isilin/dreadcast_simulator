/**
 * Bundles the Node server (server/node.ts) and its dependencies into a single
 * file, so the Docker image needs no node_modules.
 *
 * Usage: yarn build:server  ->  dist-server/index.js
 */
import { build } from 'esbuild';

await build({
  entryPoints: ['server/node.ts'],
  outfile: 'dist-server/index.js',
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
