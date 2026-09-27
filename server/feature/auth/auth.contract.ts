import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint';
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup';

import { LoginPayload, LoginResponse } from './auth.schema.js';
import { NoStore } from '../../platform/cache.js';
import {
  BadRequest,
  InternalError,
  Unauthorized,
} from '../../platform/http-errors.js';
import { InvalidRequest } from '../../platform/request-validation.js';

export const AuthGroup = HttpApiGroup.make('auth')
  .add(
    // Password sign-in through the server; the front then sets the session.
    HttpApiEndpoint.post('login', '/auth/login', {
      payload: LoginPayload,
      success: LoginResponse,
      error: [BadRequest, Unauthorized, InternalError],
    }).annotate(
      InvalidRequest,
      () => new BadRequest({ error: 'Payload de connexion invalide' }),
    ),
  )
  .middleware(NoStore);
