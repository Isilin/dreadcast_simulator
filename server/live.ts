import { sql } from 'drizzle-orm';

import { withAnon } from './db/client.js';
import { makeNodeDb } from './db/pool.js';
import type { Deps } from './deps.js';
import { makeAuthRepo } from './feature/auth/auth.repo.postgres.js';
import { makeAuthService } from './feature/auth/auth.service.live.js';
import { makeBuildRepo } from './feature/build/build.repo.postgres.js';
import { makeCatalogRepo } from './feature/catalog/catalog.repo.postgres.js';
import {
  makeCommunityPublicRepo,
  makeCommunityRepo,
  makeReviewRepo,
} from './feature/community/community.repo.postgres.js';
import { makeProfileRepo } from './feature/profile/profile.repo.postgres.js';
import { makeSubscriptionRepo } from './feature/subscription/subscription.repo.postgres.js';
import { readDatabaseConfig } from './platform/config.js';

/** Production services, configured from the environment. */
export const makeLiveDeps = (
  env: Readonly<Record<string, string | undefined>> = process.env,
): Deps => {
  const { url, poolMax } = readDatabaseConfig(env);
  const { db } = makeNodeDb(url, poolMax);

  return {
    auth: makeAuthService(makeAuthRepo(db)),
    catalog: makeCatalogRepo(db),
    communityPublic: makeCommunityPublicRepo(db),
    community: makeCommunityRepo(db),
    reviews: makeReviewRepo(db),
    builds: makeBuildRepo(db),
    subscriptions: makeSubscriptionRepo(db),
    profiles: makeProfileRepo(db),
    checkDatabase: async () => {
      await withAnon(db, (tx) =>
        tx.execute(sql`select 1 from public.game_version limit 1`),
      );
    },
  };
};
