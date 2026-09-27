import { HttpApi } from 'effect/unstable/httpapi';

import { CatalogGroup } from './feature/catalog/catalog.contract.js';
import { RequestValidation } from './platform/request-validation.js';

/**
 * HTTP contract of the backend. Only depends on `effect`, so the front can
 * derive a typed client from it.
 */
export class DreadcastApi extends HttpApi.make('dreadcast')
  .add(CatalogGroup)
  .middleware(RequestValidation)
  .prefix('/api') {}
