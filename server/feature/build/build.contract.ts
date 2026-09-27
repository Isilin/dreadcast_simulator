import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/unstable/httpapi';

import { Build, Slot, UpsertBuildPayload } from './build.schema.js';
import { Authentication } from '../../platform/auth.js';
import { NoStore } from '../../platform/cache.js';
import {
  BadRequest,
  Forbidden,
  InternalError,
  NotFound,
} from '../../platform/http-errors.js';
import { InvalidRequest } from '../../platform/request-validation.js';

/** Saved builds of the signed-in user, addressed by 1-based slot. */
export const BuildGroup = HttpApiGroup.make('builds')
  .add(
    HttpApiEndpoint.get('list', '/builds', {
      success: Schema.Array(Build),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.put('upsert', '/builds', {
      payload: UpsertBuildPayload,
      success: Build,
      error: [BadRequest, InternalError],
    }).annotate(
      InvalidRequest,
      () => new BadRequest({ error: 'Payload build invalide.' }),
    ),
  )
  .add(
    // The next slots move up.
    HttpApiEndpoint.delete('remove', '/builds', {
      query: { slot: Slot },
      error: [BadRequest, Forbidden, NotFound, InternalError],
    }).annotate(
      InvalidRequest,
      () => new BadRequest({ error: 'Slot de build invalide.' }),
    ),
  )
  .middleware(NoStore)
  .middleware(Authentication);
