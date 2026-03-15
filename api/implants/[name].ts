import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  handleSupabaseError,
  requireStringParam,
  sendJson,
} from '../../lib/helper.api';
import { IMPLANT_SELECT_QUERY, typeImplant } from '../../lib/implant.api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = requireStringParam(
    req.query.name,
    res,
    'Implant name is required',
  );
  if (!name) return;

  try {
    const supabase = doCreateClient();
    const { data: implant, error } = await supabase
      .from('implant')
      .select(IMPLANT_SELECT_QUERY)
      .eq('name', name)
      .single();

    if (error) return handleSupabaseError(res, error, 'Implant not found');

    const typedImplant = typeImplant(implant);

    if (!typedImplant) {
      return res.status(404).json({ error: 'Implant not found' });
    }

    return sendJson(res, typedImplant);
  } catch (error) {
    return handleError(res, error);
  }
}
