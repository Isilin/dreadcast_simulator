import type { VercelRequest, VercelResponse } from '@vercel/node';

import { doCreateClient, handleError, sendJson } from '../../lib/helper.api.js';
import { TITLE_SELECT_QUERY } from '../../lib/title.api.js';
import type { TitleResponseDto } from '../../lib/title.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();

    const { data: titles, error } = await supabase
      .from('title')
      .select(TITLE_SELECT_QUERY)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return sendJson(res, (titles as TitleResponseDto[]) || []);
  } catch (error) {
    return handleError(res, error);
  }
}
