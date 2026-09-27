import { Schema } from 'effect';
import * as HttpApiEndpoint from 'effect/unstable/httpapi/HttpApiEndpoint';
import type * as HttpApiError from 'effect/unstable/httpapi/HttpApiError';
import * as HttpApiGroup from 'effect/unstable/httpapi/HttpApiGroup';
import * as HttpApiSchema from 'effect/unstable/httpapi/HttpApiSchema';

import { communityError, type CommunityErrorCode } from './community.errors.js';
import { payloadErrorCode } from './community.rules.js';
import {
  BuildDetail,
  MetaResponse,
  MyPublication,
  PublishPayload,
  RecommendationsResponse,
  Review,
  ReviewPayload,
  ReviewsResponse,
  SearchQuery,
  SearchResponse,
  SimilarPayload,
  UpdatePayload,
} from './community.schema.js';
import { Authentication, OptionalAuthentication } from '../../platform/auth.js';
import { NoStore, PublicCache } from '../../platform/cache.js';
import { ApiErrors, InternalError } from '../../platform/http-errors.js';
import { InvalidRequest } from '../../platform/request-validation.js';

const params = { id: Schema.String.check(Schema.isUUID()) };

/**
 * Decoding failure -> community error: INVALID_ID for the publication id,
 * `payloadCode` (or the failing field) for the rest.
 */
const invalidRequest =
  (
    payloadCode:
      | CommunityErrorCode
      | ((error: HttpApiError.HttpApiSchemaError) => CommunityErrorCode),
  ) =>
  (error: HttpApiError.HttpApiSchemaError) =>
    communityError(
      error.kind === 'Params'
        ? 'INVALID_ID'
        : typeof payloadCode === 'function'
          ? payloadCode(error)
          : payloadCode,
    );

const fromFailingField = (error: HttpApiError.HttpApiSchemaError) =>
  payloadErrorCode(error.cause.issue);

const IdResponse = Schema.Struct({ id: Schema.String });
const FavoriteResponse = Schema.Struct({ is_favorite: Schema.Boolean });

/**
 * Community: publications, search, reviews, favorites, recommendations.
 * Errors carry `{ error, code }` (see community.errors.ts).
 */
export const CommunityGroup = HttpApiGroup.make('community')
  // --- Signed-in endpoints ---------------------------------------------------
  .add(
    HttpApiEndpoint.get('search', '/community/builds', {
      query: SearchQuery,
      success: SearchResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_FILTERS')),
  )
  .add(
    HttpApiEndpoint.post('publish', '/community/builds', {
      payload: PublishPayload,
      success: IdResponse.pipe(HttpApiSchema.status(201)),
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest(fromFailingField)),
  )
  .add(
    HttpApiEndpoint.get('mine', '/community/me', {
      success: Schema.Array(MyPublication),
      error: ApiErrors,
    }),
  )
  .add(
    HttpApiEndpoint.post('similar', '/community/similar', {
      payload: SimilarPayload,
      success: RecommendationsResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest(fromFailingField)),
  )
  .add(
    HttpApiEndpoint.get('forYou', '/community/for-you', {
      success: RecommendationsResponse,
      error: ApiErrors,
    }),
  )
  .add(
    HttpApiEndpoint.put('update', '/community/builds/:id', {
      params,
      payload: UpdatePayload,
      success: IdResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest(fromFailingField)),
  )
  .add(
    HttpApiEndpoint.delete('unpublish', '/community/builds/:id', {
      params,
      success: IdResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .add(
    HttpApiEndpoint.post('copy', '/community/builds/:id/copy', {
      params,
      success: Schema.Struct({ slot: Schema.Number }).pipe(
        HttpApiSchema.status(201),
      ),
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .add(
    HttpApiEndpoint.get('reviews', '/community/builds/:id/reviews', {
      params,
      // Lenient like before: anything but a positive integer means page 1.
      query: { page: Schema.optionalKey(Schema.String) },
      success: ReviewsResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .add(
    HttpApiEndpoint.put('saveReview', '/community/builds/:id/review', {
      params,
      payload: ReviewPayload,
      success: Review,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_REVIEW')),
  )
  .add(
    HttpApiEndpoint.delete('deleteReview', '/community/builds/:id/review', {
      params,
      success: Schema.Struct({ deleted: Schema.Boolean }),
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .add(
    HttpApiEndpoint.put('addFavorite', '/community/builds/:id/favorite', {
      params,
      success: FavoriteResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .add(
    HttpApiEndpoint.delete('removeFavorite', '/community/builds/:id/favorite', {
      params,
      success: FavoriteResponse,
      error: ApiErrors,
    }).annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD')),
  )
  .middleware(NoStore)
  .middleware(Authentication)
  // --- Open to guests (added after the group middlewares) --------------------
  .add(
    // Without a session, a shared link opens the locked preview.
    HttpApiEndpoint.get('detail', '/community/builds/:id', {
      params,
      success: BuildDetail,
      error: ApiErrors,
    })
      .annotate(InvalidRequest, invalidRequest('INVALID_PAYLOAD'))
      .middleware(NoStore)
      .middleware(OptionalAuthentication),
  )
  .add(
    HttpApiEndpoint.get('meta', '/community/meta', {
      success: MetaResponse,
      error: InternalError,
    }).middleware(PublicCache),
  );
