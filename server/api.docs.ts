import type { OpenAPIHono } from '@hono/zod-openapi';

/** OpenAPI document generated from the route schemas. */
export const OPENAPI_PATH = '/api/openapi.json';

const DOCS_PATH = '/api/docs';

const DOCUMENT_CONFIG = {
  openapi: '3.1.0',
  info: { title: 'Dreadcast Simulator API', version: '1' },
};

/**
 * Scalar loaded from jsDelivr rather than bundled (it weighs 3 MB and would
 * be loaded on every cold start of the Vercel function).
 */
const SCALAR_URL =
  'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.85.0/dist/browser/standalone.min.js';

/** JSON safe to inline in a <script> element. */
const toInlineJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const renderDocs = (document: unknown) => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dreadcast Simulator API</title>
  </head>
  <body>
    <div id="api-reference"></div>
    <script src="${SCALAR_URL}" crossorigin></script>
    <script>
      Scalar.createApiReference(document.getElementById('api-reference'), {
        _integration: 'html',
        content: ${toInlineJson(document)},
      });
    </script>
  </body>
</html>`;

/**
 * GET /api/openapi.json and the API reference page GET /api/docs (rendered
 * once, on first request).
 */
export const registerDocs = (app: OpenAPIHono) => {
  app.doc31(OPENAPI_PATH, DOCUMENT_CONFIG);

  let html: string | undefined;
  app.get(DOCS_PATH, (c) =>
    c.html((html ??= renderDocs(app.getOpenAPI31Document(DOCUMENT_CONFIG)))),
  );
};
