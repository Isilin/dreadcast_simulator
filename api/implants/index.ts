import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  getOptionalStringParam,
  handleError,
  handleSupabaseError,
  sendJson,
} from '../../lib/helper.api.js';
import { IMPLANT_SELECT_QUERY } from '../../lib/implant.api.js';
import type { ImplantResponseDto } from '../../lib/implant.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const query = getOptionalStringParam(req.query.query);
    const name = getOptionalStringParam(req.query.name);

    if (name) {
      const { data: implant, error } = await supabase
        .from('implant')
        .select(IMPLANT_SELECT_QUERY)
        .eq('name', name)
        .single();

      if (error) {
        return handleSupabaseError(res, error, 'Implant not found');
      }

      return sendJson(res, implant as ImplantResponseDto);
    }

    let implantQuery = supabase.from('implant').select(IMPLANT_SELECT_QUERY);

    if (query && query.trim()) {
      implantQuery = implantQuery.ilike('name', `%${query}%`);
    }

    const { data: implants, error } = await implantQuery.order('name', {
      ascending: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedImplants = (implants as ImplantResponseDto[]) || [];

    return sendJson(res, typedImplants);
  } catch (error) {
    return handleError(res, error);
  }
}
