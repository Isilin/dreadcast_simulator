import { Effect, Layer } from 'effect';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { ProfileRepo } from './profile.repo.js';
import { DreadcastApi } from '../../api.contract.js';
import { NoStoreLive } from '../../platform/cache.js';
import { toInternalError, type DbError } from '../../platform/db-error.js';
import { communityError } from '../community/community.errors.js';

/** Constraint violations of the user_profile insert. */
const toPseudoError = (error: DbError) => {
  if (error.code === '23505') {
    return communityError(
      error.message.includes('user_profile_pkey')
        ? 'PSEUDO_ALREADY_SET'
        : 'PSEUDO_TAKEN',
    );
  }
  if (error.code === '23514') {
    return communityError('INVALID_PSEUDO');
  }
  return toInternalError(error);
};

export const ProfileHandlers = HttpApiBuilder.group(
  DreadcastApi,
  'profile',
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* ProfileRepo;

      return handlers
        .handle('me', () =>
          repo.pseudo.pipe(
            Effect.map((pseudo) => ({ pseudo })),
            Effect.mapError(toInternalError),
          ),
        )
        .handle('setPseudo', ({ payload }) =>
          Effect.gen(function* () {
            const current = yield* repo.pseudo.pipe(
              Effect.mapError(toInternalError),
            );
            if (current) {
              return yield* communityError('PSEUDO_ALREADY_SET');
            }

            const pseudo = yield* repo
              .createPseudo(payload.pseudo)
              .pipe(Effect.mapError(toPseudoError));
            return { pseudo };
          }),
        );
    }),
).pipe(Layer.provide(NoStoreLive));
