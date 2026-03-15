import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  handleSupabaseError,
  requireStringParam,
  sendJson,
} from '../../lib/helper.api.js';
import { RACE_SELECT_QUERY, typeRace } from '../../lib/race.api.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const type = requireStringParam(req.query.type, res, 'Race type is required');
  if (!type) return;

  try {
    const supabase = doCreateClient();
    const { data: race, error } = await supabase
      .from('race')
      .select(RACE_SELECT_QUERY)
      .eq('type', type)
      .single();

    if (error) return handleSupabaseError(res, error, 'Race not found');

    const typedRace = typeRace(race);

    if (!typedRace) {
      return res.status(404).json({ error: 'Race not found' });
    }

    return sendJson(res, typedRace);
  } catch (error) {
    return handleError(res, error);
  }
}
