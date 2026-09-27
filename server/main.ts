// Subpath imports: the package barrel also loads NodeRedis (needs `redis`).
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { createServer } from 'node:http';

import { ApiLive } from './api.layer.js';

/**
 * Local API server (yarn dev:api). Point the Vite proxy at it with
 * API_PROXY_TARGET=http://localhost:3001. Warning: .env.local targets the
 * production database.
 */
const PORT = Number(process.env.API_PORT ?? 3001);

const ServerLive = HttpRouter.serve(ApiLive).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: PORT })),
);

NodeRuntime.runMain(Layer.launch(ServerLive));
