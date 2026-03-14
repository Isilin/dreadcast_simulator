import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { RACE_SELECT_QUERY, typeRace } from '../../lib/race.api.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  if (!type || typeof type !== 'string') {
    return res.status(400).json({ error: 'Race type is required' });
  }

  try {
    const supabase = doCreateClient();
    const { data: race, error } = await supabase
      .from('race')
      .select(RACE_SELECT_QUERY)
      .eq('type', type)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Race not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedRace = typeRace(race);

    if (!typedRace) {
      return res.status(404).json({ error: 'Race not found' });
    }

    setCacheHeaders(res);
    return res.status(200).json(typedRace);
  } catch (error) {
    return handleError(res, error);
  }
}
