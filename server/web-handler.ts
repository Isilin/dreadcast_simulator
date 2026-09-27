import { HttpRouter } from 'effect/unstable/http';

import { ApiLive } from './api.layer.js';

/** Web-standard entry point: (Request) => Promise<Response>. */
export const { handler, dispose } = HttpRouter.toWebHandler(ApiLive, {
  disableLogger: true,
});
