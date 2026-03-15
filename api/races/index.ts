import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  getOptionalStringParam,
  handleError,
  handleSupabaseError,
  sendJson,
} from '../../lib/helper.api.js';
import { RACE_SELECT_QUERY } from '../../lib/race.api.js';
import type { RaceResponseDto } from '../../lib/race.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const type = getOptionalStringParam(req.query.type);

    if (type) {
      const { data: race, error } = await supabase
        .from('race')
        .select(RACE_SELECT_QUERY)
        .eq('type', type)
        .single();

      if (error) {
        return handleSupabaseError(res, error, 'Race not found');
      }

      return sendJson(res, race as RaceResponseDto);
    }

    const { data: races, error } = await supabase
      .from('race')
      .select(RACE_SELECT_QUERY)
      .order('type', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedRaces = (races as RaceResponseDto[]) || [];

    return sendJson(res, typedRaces);
  } catch (error) {
    return handleError(res, error);
  }
}
