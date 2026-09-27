import { Layer } from 'effect';
import { HttpServer } from 'effect/unstable/http';
import * as HttpApiBuilder from 'effect/unstable/httpapi/HttpApiBuilder';

import { DreadcastApi } from './api.contract.js';
import { DocsLive, OPENAPI_PATH } from './api.docs.js';
import { AuthGateway } from './feature/auth/auth.gateway.js';
import { AuthHandlers } from './feature/auth/auth.handlers.js';
import { BuildHandlers } from './feature/build/build.handlers.js';
import { BuildRepo } from './feature/build/build.repo.js';
import { CatalogHandlers } from './feature/catalog/catalog.handlers.js';
import { CatalogRepo } from './feature/catalog/catalog.repo.js';
import { CommunityHandlers } from './feature/community/community.handlers.js';
import {
  CommunityRepo,
  ReviewRepo,
} from './feature/community/community.repo.js';
import { ProfileHandlers } from './feature/profile/profile.handlers.js';
import { ProfileRepo } from './feature/profile/profile.repo.js';
import { SubscriptionHandlers } from './feature/subscription/subscription.handlers.js';
import { SubscriptionRepo } from './feature/subscription/subscription.repo.js';
import type {
  Authentication,
  OptionalAuthentication,
} from './platform/auth.js';
import {
  AuthenticationLive,
  OptionalAuthenticationLive,
} from './platform/auth.live.js';
import { RequestValidationLive } from './platform/request-validation.js';
import { Supabase } from './platform/supabase.js';

/** Services behind the handlers: real ones in production, fakes in tests. */
export type ApiServices =
  | Authentication
  | AuthGateway
  | BuildRepo
  | CatalogRepo
  | CommunityRepo
  | OptionalAuthentication
  | ProfileRepo
  | ReviewRepo
  | SubscriptionRepo;

export const ApiHandlersLive = Layer.mergeAll(
  AuthHandlers,
  BuildHandlers,
  CatalogHandlers,
  CommunityHandlers,
  ProfileHandlers,
  SubscriptionHandlers,
).pipe(Layer.provide(RequestValidationLive));

export const ApiServicesLive = Layer.mergeAll(
  AuthenticationLive,
  OptionalAuthenticationLive,
  AuthGateway.layer,
  BuildRepo.layer,
  CatalogRepo.layer,
  CommunityRepo.layer,
  ProfileRepo.layer,
  ReviewRepo.layer,
  SubscriptionRepo.layer,
).pipe(Layer.provide(Supabase.layer));

/**
 * HTTP API (+ OpenAPI document and reference page) without its services:
 * provide real or fake ones.
 */
export const makeApiLayer = <E, R>(services: Layer.Layer<ApiServices, E, R>) =>
  Layer.mergeAll(
    HttpApiBuilder.layer(DreadcastApi, { openapiPath: OPENAPI_PATH }),
    DocsLive,
  ).pipe(
    Layer.provide(ApiHandlersLive),
    Layer.provide(services),
    Layer.provide(HttpServer.layerServices),
  );

export const ApiLive = makeApiLayer(ApiServicesLive);
