import { Effect } from 'effect';
import { HttpRouter, HttpServerResponse } from 'effect/unstable/http';
import * as OpenApi from 'effect/unstable/httpapi/OpenApi';

import { DreadcastApi } from './api.contract.js';

/** OpenAPI document generated from the contract (HttpApiBuilder.layer). */
export const OPENAPI_PATH = '/api/openapi.json';

const DOCS_PATH = '/api/docs';

/**
 * Scalar loaded from jsDelivr: the copy bundled in HttpApiScalar weighs 3 MB
 * and would be loaded on every cold start of the function.
 */
const SCALAR_URL =
  'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.72.1/dist/browser/standalone.min.js';

/** JSON safe to inline in a <script> element. */
const toInlineJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const renderDocs = () => `<!doctype html>
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
        content: ${toInlineJson(OpenApi.fromApi(DreadcastApi))},
      });
    </script>
  </body>
</html>`;

/** API reference page: GET /api/docs (rendered once, on first request). */
export const DocsLive = HttpRouter.use((router) => {
  let html: string | undefined;
  return router.add(
    'GET',
    DOCS_PATH,
    Effect.sync(() => HttpServerResponse.html((html ??= renderDocs()))),
  );
});
