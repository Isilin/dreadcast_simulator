import type { ProfileRepo } from './profile.repo.js';
import type { User } from '../../platform/auth.js';
import { runQuery } from '../../platform/supabase.js';

export const makeProfileRepo = ({ supabase, userId }: User): ProfileRepo => ({
  pseudo: async () => {
    const row = await runQuery(
      supabase
        .from('user_profile')
        .select('pseudo')
        .eq('user_id', userId)
        .maybeSingle(),
    );
    return row?.pseudo ?? null;
  },
  pseudosOf: async (userIds) => {
    if (userIds.length === 0) {
      return new Map();
    }
    const rows = await runQuery(
      supabase
        .from('user_profile')
        .select('user_id, pseudo')
        .in('user_id', [...userIds]),
    );
    return new Map(rows.map((row) => [row.user_id, row.pseudo]));
  },
  createPseudo: async (pseudo) => {
    const row = await runQuery(
      supabase
        .from('user_profile')
        .insert({ user_id: userId, pseudo })
        .select('pseudo')
        .single(),
    );
    return row.pseudo;
  },
});
