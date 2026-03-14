import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { RACE_SELECT_QUERY } from '../../lib/race.api.ts';
import type { RaceResponseDto } from '../../lib/race.types.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const { data: races, error } = await supabase
      .from('race')
      .select(RACE_SELECT_QUERY)
      .order('type', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedRaces = (races as RaceResponseDto[]) || [];

    setCacheHeaders(res);
    return res.status(200).json(typedRaces);
  } catch (error) {
    return handleError(res, error);
  }
}
