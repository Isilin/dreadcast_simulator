export const PATH_PARAM = '__path';

/**
 * Rebuilds the request the client sent from a vercel.json rewrite
 * (`/api/<path>?q` -> `/api/server?__path=<path>&q`).
 */
export const toApiRequest = (request: Request): Request => {
  const url = new URL(request.url);
  const path = url.searchParams.get(PATH_PARAM);
  if (path === null) {
    return request;
  }

  url.searchParams.delete(PATH_PARAM);
  url.pathname = `/api/${path.replace(/^\/+/, '')}`;
  return new Request(url, request);
};
