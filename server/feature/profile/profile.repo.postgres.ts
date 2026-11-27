import { eq, inArray } from 'drizzle-orm';

import type { ProfileRepo } from './profile.repo.js';
import { withUser, type Db } from '../../db/client.js';
import { firstOrNull, single } from '../../db/rows.js';
import { user_profile } from '../../db/schema.js';
import type { User } from '../../platform/auth.js';

export const makeProfileRepo =
  (db: Db) =>
  (user: User): ProfileRepo => ({
    pseudo: () =>
      withUser(db, user, async (tx) => {
        const row = firstOrNull(
          await tx
            .select({ pseudo: user_profile.pseudo })
            .from(user_profile)
            .where(eq(user_profile.user_id, user.userId)),
        );
        return row?.pseudo ?? null;
      }),
    pseudosOf: async (userIds) => {
      if (userIds.length === 0) {
        return new Map();
      }
      const rows = await withUser(db, user, (tx) =>
        tx
          .select({
            user_id: user_profile.user_id,
            pseudo: user_profile.pseudo,
          })
          .from(user_profile)
          .where(inArray(user_profile.user_id, [...userIds])),
      );
      return new Map(rows.map((row) => [row.user_id, row.pseudo]));
    },
    createPseudo: (pseudo) =>
      withUser(db, user, async (tx) => {
        const row = single(
          await tx
            .insert(user_profile)
            .values({ user_id: user.userId, pseudo })
            .returning({ pseudo: user_profile.pseudo }),
        );
        return row.pseudo;
      }),
  });
