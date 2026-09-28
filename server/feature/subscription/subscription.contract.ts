import { Schema } from 'effect';
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint';
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup';
import * as HttpApiSchema from 'effect/unstable/httpapi/HttpApiSchema';

import {
  CreateSubscriptionPayload,
  Subscription,
  SubscriptionPlan,
} from './subscription.schema.js';
import { Authentication } from '../../platform/auth.js';
import { NoStore } from '../../platform/cache.js';
import { BadRequest, InternalError } from '../../platform/http-errors.js';
import { InvalidRequest } from '../../platform/request-validation.js';

export const SubscriptionGroup = HttpApiGroup.make('subscriptions')
  .add(
    HttpApiEndpoint.get('plans', '/subscription-plans', {
      success: Schema.Array(SubscriptionPlan),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.get('listMine', '/subscriptions', {
      success: Schema.Array(Subscription),
      error: InternalError,
    }),
  )
  .add(
    HttpApiEndpoint.post('create', '/subscriptions', {
      payload: CreateSubscriptionPayload,
      success: Subscription.pipe(HttpApiSchema.status(201)),
      error: [BadRequest, InternalError],
    }).annotate(
      InvalidRequest,
      () => new BadRequest({ error: 'Payload abonnement invalide.' }),
    ),
  )
  .middleware(NoStore)
  .middleware(Authentication);
