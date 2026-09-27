import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { BuildRepo } from './build.repo.js';
import { findBySlot, toBuildDto } from './build.rules.js';
import { DreadcastApi } from '../../api.contract.js';
import { NoStoreLive } from '../../platform/cache.js';
import type { Json } from '../../platform/database.gen.js';
import { toInternalError } from '../../platform/db-error.js';
import { Forbidden, NotFound } from '../../platform/http-errors.js';

export const BuildHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'builds',
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* BuildRepo;

      return handlers
        .handle('list', () =>
          repo.listOrdered.pipe(
            Effect.map((rows) =>
              rows.map((row, index) => toBuildDto(row, index + 1)),
            ),
            Effect.mapError(toInternalError),
          ),
        )
        .handle('upsert', ({ payload }) =>
          Effect.gen(function* () {
            const savedAt = new Date().toISOString();
            const snapshot = payload.snapshot as Json;
            const builds = yield* repo.listOrdered;
            const target = findBySlot(builds, payload.slot);

            if (target) {
              const row = yield* repo.update(target.id, snapshot, savedAt);
              return toBuildDto(row, payload.slot);
            }

            const row = yield* repo.insert(snapshot, savedAt);
            return toBuildDto(row, builds.length + 1);
          }).pipe(Effect.mapError(toInternalError)),
        )
        .handle('remove', ({ query }) =>
          Effect.gen(function* () {
            const builds = yield* repo.listOrdered.pipe(
              Effect.mapError(toInternalError),
            );
            const target = findBySlot(builds, query.slot);
            if (!target) {
              return yield* new NotFound({ error: 'Build introuvable.' });
            }

            const deleted = yield* repo
              .remove(target.id)
              .pipe(Effect.mapError(toInternalError));

            // Row level security skips the row silently when deletion is refused.
            if (deleted.length === 0) {
              return yield* new Forbidden({
                error: 'Suppression du build refusée.',
              });
            }
          }),
        );
    }),
).pipe(Layer.provide(NoStoreLive));
