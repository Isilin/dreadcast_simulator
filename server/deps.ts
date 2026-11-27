import type { AuthService } from './feature/auth/auth.service.js';
import type { CatalogRepo } from './feature/catalog/catalog.repo.js';
import type { CommunityDeps } from './feature/community/community.routes.js';

/**
 * Services behind the routes: real ones in production (live.ts), fakes in
 * tests. User-scoped repositories are built per request from the caller.
 */
export interface Deps extends CommunityDeps {
  readonly auth: AuthService;
  readonly catalog: CatalogRepo;
  /** Throws when the database is unreachable. */
  readonly checkDatabase: () => Promise<void>;
}
