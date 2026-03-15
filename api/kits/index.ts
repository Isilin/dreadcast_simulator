import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  getOptionalStringParam,
  handleError,
  handleSupabaseError,
  sendJson,
} from '../../lib/helper.api.js';
import { KIT_SELECT_QUERY } from '../../lib/kit.api.js';
import type { KitResponseDto } from '../../lib/kit.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const query = getOptionalStringParam(req.query.query);
    const typeParam = getOptionalStringParam(req.query.type);
    const id = getOptionalStringParam(req.query.id);

    if (id) {
      const { data: kit, error } = await supabase
        .from('kit')
        .select(KIT_SELECT_QUERY)
        .eq('id', id)
        .single();

      if (error) {
        return handleSupabaseError(res, error, 'Kit not found');
      }

      return sendJson(res, kit as KitResponseDto);
    }

    let kitsQuery = supabase.from('kit').select(KIT_SELECT_QUERY);

    if (query && query.trim()) {
      kitsQuery = kitsQuery.ilike('name', `%${query}%`);
    }

    if (typeParam && typeParam.trim()) {
      const types = typeParam.split(',').map((t) => t.trim());
      kitsQuery = kitsQuery.in('type', types);
    }

    const { data: kits, error } = await kitsQuery.order('name', {
      ascending: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedKits = (kits as KitResponseDto[]) || [];

    return sendJson(res, typedKits);
  } catch (error) {
    return handleError(res, error);
  }
}
