import type { AuthGateway } from './feature/auth/auth.gateway.js';
import type { CatalogRepo } from './feature/catalog/catalog.repo.js';
import type { CommunityDeps } from './feature/community/community.routes.js';
import type { ResolveUser } from './platform/auth.js';

/**
 * Services behind the routes: real ones in production (live.ts), fakes in
 * tests. User-scoped repositories are built per request from the caller.
 */
export interface Deps extends CommunityDeps {
  readonly resolveUser: ResolveUser;
  readonly authGateway: AuthGateway;
  readonly catalog: CatalogRepo;
  /** Throws when the database is unreachable. */
  readonly checkDatabase: () => Promise<void>;
}
