import type { VercelRequest, VercelResponse } from '@vercel/node';

import { doCreateClient, handleError, sendJson } from '../../lib/helper.api.js';
import { IMPLANT_SELECT_QUERY } from '../../lib/implant.api.js';
import type { ImplantResponseDto } from '../../lib/implant.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const { data: implants, error } = await supabase
      .from('implant')
      .select(IMPLANT_SELECT_QUERY)
      .order('id', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedImplants = (implants as ImplantResponseDto[]) || [];

    return sendJson(res, typedImplants);
  } catch (error) {
    return handleError(res, error);
  }
}
