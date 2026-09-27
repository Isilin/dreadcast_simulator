import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from 'effect/unstable/httpapi';

import { Profile, PseudoPayload } from './profile.schema.js';
import { Authentication } from '../../platform/auth.js';
import { NoStore } from '../../platform/cache.js';
import {
  Conflict,
  InternalError,
  Unprocessable,
} from '../../platform/http-errors.js';
import { InvalidRequest } from '../../platform/request-validation.js';
import { communityError } from '../community/community.errors.js';

export const ProfileGroup = HttpApiGroup.make('profile')
  .add(
    HttpApiEndpoint.get('me', '/profile/me', {
      success: Profile,
      error: InternalError,
    }),
  )
  .add(
    // The pseudo is definitive: PUT only creates it.
    HttpApiEndpoint.put('setPseudo', '/profile/me', {
      payload: PseudoPayload,
      success: Profile.pipe(HttpApiSchema.status(201)),
      error: [Conflict, Unprocessable, InternalError],
    }).annotate(InvalidRequest, () => communityError('INVALID_PSEUDO')),
  )
  .middleware(NoStore)
  .middleware(Authentication);
