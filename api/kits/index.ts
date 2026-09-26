import type { VercelRequest, VercelResponse } from '@vercel/node';

import { doCreateClient, handleError, sendJson } from '../../lib/helper.api.js';
import { KIT_SELECT_QUERY } from '../../lib/kit.api.js';
import type { KitResponseDto } from '../../lib/kit.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const { data: kits, error } = await supabase
      .from('kit')
      .select(KIT_SELECT_QUERY)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedKits = (kits as unknown as KitResponseDto[]) || [];

    return sendJson(res, typedKits);
  } catch (error) {
    return handleError(res, error);
  }
}
