import { HttpApi } from 'effect/unstable/httpapi';

import { AuthGroup } from './feature/auth/auth.contract.js';
import { BuildGroup } from './feature/build/build.contract.js';
import { CatalogGroup } from './feature/catalog/catalog.contract.js';
import { CommunityGroup } from './feature/community/community.contract.js';
import { ProfileGroup } from './feature/profile/profile.contract.js';
import { SubscriptionGroup } from './feature/subscription/subscription.contract.js';
import { RequestValidation } from './platform/request-validation.js';

/**
 * HTTP contract of the backend. Only depends on `effect`, so the front can
 * derive a typed client from it.
 */
export class DreadcastApi extends HttpApi.make('dreadcast')
  .add(CatalogGroup)
  .add(AuthGroup)
  .add(BuildGroup)
  .add(SubscriptionGroup)
  .add(ProfileGroup)
  .add(CommunityGroup)
  .middleware(RequestValidation)
  .prefix('/api') {}
