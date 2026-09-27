import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { CatalogRepo } from './catalog.repo.js';
import { DreadcastApi } from '../../api.contract.js';
import { PublicCacheLive } from '../../platform/cache.js';
import {
  notFoundOrInternal,
  toInternalError,
} from '../../platform/db-error.js';

export const CatalogHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'catalog',
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* CatalogRepo;

      return handlers
        .handle('items', () =>
          repo.items.pipe(Effect.mapError(toInternalError)),
        )
        .handle('kits', () => repo.kits.pipe(Effect.mapError(toInternalError)))
        .handle('implants', () =>
          repo.implants.pipe(Effect.mapError(toInternalError)),
        )
        .handle('races', () =>
          repo.races.pipe(Effect.mapError(toInternalError)),
        )
        .handle('titles', () =>
          repo.titles.pipe(Effect.mapError(toInternalError)),
        )
        .handle('drugs', ({ query }) => {
          const id = query.id?.trim();
          return id
            ? repo
                .drug(id)
                .pipe(Effect.catch(notFoundOrInternal('Drug not found')))
            : repo.drugs.pipe(Effect.mapError(toInternalError));
        });
    }),
).pipe(Layer.provide(PublicCacheLive));
