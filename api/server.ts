import { toApiRequest } from '../server/vercel.js';
import { handler } from '../server/web-handler.js';

/**
 * Single Vercel function of the backend. vercel.json rewrites the migrated
 * /api/* routes here with the original path in `?__path=`.
 */
export default {
  fetch: (request: Request) => handler(toApiRequest(request)),
};
