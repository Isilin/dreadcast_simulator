import type { BuildRepo } from './build.repo.js';
import type { User } from '../../platform/auth.js';
import { runQuery } from '../../platform/supabase.js';

const BUILD_SELECT = 'id, snapshot, saved_at';

export const makeBuildRepo = ({ supabase, userId }: User): BuildRepo => ({
  listOrdered: () =>
    runQuery(
      supabase
        .from('build')
        .select(BUILD_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true }),
    ),
  update: (id, snapshot, savedAt) =>
    runQuery(
      supabase
        .from('build')
        .update({ snapshot, saved_at: savedAt })
        .eq('id', id)
        .eq('user_id', userId)
        .select(BUILD_SELECT)
        .single(),
    ),
  insert: (snapshot, savedAt) =>
    runQuery(
      supabase
        .from('build')
        .insert({ user_id: userId, snapshot, saved_at: savedAt })
        .select(BUILD_SELECT)
        .single(),
    ),
  remove: async (id) => {
    const rows = await runQuery(
      supabase
        .from('build')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id'),
    );
    return rows.map((row) => row.id);
  },
});
