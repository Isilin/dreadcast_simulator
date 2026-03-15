import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  handleSupabaseError,
  requireStringParam,
  sendJson,
} from '../../lib/helper.api.js';
import { KIT_SELECT_QUERY, typeKit } from '../../lib/kit.api.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = requireStringParam(req.query.id, res, 'Kit ID is required');
  if (!id) return;

  try {
    const supabase = doCreateClient();
    const { data: kit, error } = await supabase
      .from('kit')
      .select(KIT_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(res, error, 'Kit not found');

    const typedKit = typeKit(kit);

    if (!typedKit) {
      return res.status(404).json({ error: 'Kit not found' });
    }

    return sendJson(res, typedKit);
  } catch (error) {
    return handleError(res, error);
  }
}
