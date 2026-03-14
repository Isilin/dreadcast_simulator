import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { KIT_SELECT_QUERY, typeKit } from '../../lib/kit.api.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Kit ID is required' });
  }

  try {
    const supabase = doCreateClient();
    const { data: kit, error } = await supabase
      .from('kit')
      .select(KIT_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Kit not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedKit = typeKit(kit);

    if (!typedKit) {
      return res.status(404).json({ error: 'Kit not found' });
    }

    setCacheHeaders(res);
    return res.status(200).json(typedKit);
  } catch (error) {
    return handleError(res, error);
  }
}
