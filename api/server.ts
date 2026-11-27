import { createApp } from '../server/app.js';
import { makeLiveDeps } from '../server/live.js';
import { toApiRequest } from '../server/vercel.js';

const app = createApp(makeLiveDeps());

/**
 * Single Vercel function of the backend. vercel.json rewrites /api/* here
 * with the original path in `?__path=`.
 */
export default {
  fetch: (request: Request) => app.fetch(toApiRequest(request)),
};
