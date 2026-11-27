import type { Deps } from './deps.js';
import { makeAuthGateway } from './feature/auth/auth.gateway.supabase.js';
import { makeBuildRepo } from './feature/build/build.repo.supabase.js';
import { makeCatalogRepo } from './feature/catalog/catalog.repo.supabase.js';
import {
  makeCommunityPublicRepo,
  makeCommunityRepo,
  makeReviewRepo,
} from './feature/community/community.repo.supabase.js';
import { makeProfileRepo } from './feature/profile/profile.repo.supabase.js';
import { makeSubscriptionRepo } from './feature/subscription/subscription.repo.supabase.js';
import { readSupabaseConfig } from './platform/config.js';
import {
  makeResolveUser,
  makeSupabase,
  runQuery,
} from './platform/supabase.js';

/** Production services, configured from the environment. */
export const makeLiveDeps = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): Deps => {
  const supabase = makeSupabase(readSupabaseConfig(env));

  return {
    resolveUser: makeResolveUser(supabase),
    authGateway: makeAuthGateway(supabase),
    catalog: makeCatalogRepo(supabase),
    communityPublic: makeCommunityPublicRepo(supabase),
    community: makeCommunityRepo,
    reviews: makeReviewRepo,
    builds: makeBuildRepo,
    subscriptions: makeSubscriptionRepo,
    profiles: makeProfileRepo,
    checkDatabase: async () => {
      await runQuery(
        supabase.anon().from('game_version').select('code').limit(1),
      );
    },
  };
};
