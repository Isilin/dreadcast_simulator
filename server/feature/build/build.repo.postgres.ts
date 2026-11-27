import { and, asc, eq } from 'drizzle-orm';

import type { BuildRepo } from './build.repo.js';
import { withUser, type Db } from '../../db/client.js';
import { single } from '../../db/rows.js';
import { build } from '../../db/schema.js';
import type { User } from '../../platform/auth.js';

const BUILD_COLUMNS = {
  id: build.id,
  snapshot: build.snapshot,
  saved_at: build.saved_at,
};

export const makeBuildRepo =
  (db: Db) =>
  (user: User): BuildRepo => {
    const mine = eq(build.user_id, user.userId);
    return {
      listOrdered: () =>
        withUser(db, user, (tx) =>
          tx
            .select(BUILD_COLUMNS)
            .from(build)
            .where(mine)
            .orderBy(asc(build.created_at), asc(build.id)),
        ),
      update: (id, snapshot, savedAt) =>
        withUser(db, user, async (tx) =>
          single(
            await tx
              .update(build)
              .set({ snapshot, saved_at: savedAt })
              .where(and(eq(build.id, id), mine))
              .returning(BUILD_COLUMNS),
          ),
        ),
      insert: (snapshot, savedAt) =>
        withUser(db, user, async (tx) =>
          single(
            await tx
              .insert(build)
              .values({ user_id: user.userId, snapshot, saved_at: savedAt })
              .returning(BUILD_COLUMNS),
          ),
        ),
      remove: (id) =>
        withUser(db, user, async (tx) => {
          const rows = await tx
            .delete(build)
            .where(and(eq(build.id, id), mine))
            .returning({ id: build.id });
          return rows.map((row) => row.id);
        }),
    };
  };
