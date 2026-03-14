import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { IMPLANT_SELECT_QUERY, typeImplant } from '../../lib/implant.api.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Implant name is required' });
  }

  try {
    const supabase = doCreateClient();
    const { data: implant, error } = await supabase
      .from('implant')
      .select(IMPLANT_SELECT_QUERY)
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Implant not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedImplant = typeImplant(implant);

    if (!typedImplant) {
      return res.status(404).json({ error: 'Implant not found' });
    }

    setCacheHeaders(res);
    return res.status(200).json(typedImplant);
  } catch (error) {
    return handleError(res, error);
  }
}
