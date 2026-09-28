import { Schema } from 'effect';
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint';
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup';

import { Drug, Implant, Item, Kit, Race, Title } from './catalog.schema.js';
import { PublicCache } from '../../platform/cache.js';
import { InternalError, NotFound } from '../../platform/http-errors.js';

/** Public reference data of the simulator. */
export const CatalogGroup = HttpApiGroup.make('catalog')
  .add(
    HttpApiEndpoint.get('items', '/items', {
      success: Schema.Array(Item),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.get('kits', '/kits', {
      success: Schema.Array(Kit),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.get('implants', '/implants', {
      success: Schema.Array(Implant),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.get('races', '/races', {
      success: Schema.Array(Race),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.get('titles', '/titles', {
      success: Schema.Array(Title),
      error: InternalError,
    }),
  )
  .add(
    // `?id=` returns a single drug (legacy query-string shape).
    HttpApiEndpoint.get('drugs', '/drugs', {
      query: { id: Schema.optionalKey(Schema.String) },
      success: [Schema.Array(Drug), Drug],
      error: [NotFound, InternalError],
    }),
  )
  .middleware(PublicCache);
