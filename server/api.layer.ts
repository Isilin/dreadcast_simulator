import { Layer } from 'effect';
import { HttpServer } from 'effect/unstable/http';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { DreadcastApi } from './api.contract.js';
import { CatalogHandlers } from './feature/catalog/catalog.handlers.js';
import { CatalogRepo } from './feature/catalog/catalog.repo.js';
import { RequestValidationLive } from './platform/request-validation.js';
import { Supabase } from './platform/supabase.js';

/** Handlers of every group. Repositories are provided separately (tests). */
export const ApiHandlersLive = Layer.mergeAll(CatalogHandlers).pipe(
  Layer.provide(RequestValidationLive),
);

export const RepositoriesLive = Layer.mergeAll(CatalogRepo.layer).pipe(
  Layer.provide(Supabase.layer),
);

/** HTTP API without its repositories: provide real or fake ones. */
export const makeApiLayer = <E, R>(
  repositories: Layer.Layer<CatalogRepo, E, R>,
) =>
  HttpApiBuilder.layer(DreadcastApi).pipe(
    Layer.provide(ApiHandlersLive),
    Layer.provide(repositories),
    Layer.provide(HttpServer.layerServices),
  );

export const ApiLive = makeApiLayer(RepositoriesLive);
