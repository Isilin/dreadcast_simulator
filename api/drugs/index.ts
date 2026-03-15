import type { VercelRequest, VercelResponse } from '@vercel/node';

import { DRUG_SELECT_QUERY } from '../../lib/drug.api.js';
import type { DrugResponseDto } from '../../lib/drug.types.js';
import {
  doCreateClient,
  getOptionalStringParam,
  handleError,
  handleSupabaseError,
  sendJson,
} from '../../lib/helper.api.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const query = getOptionalStringParam(req.query.query);
    const id = getOptionalStringParam(req.query.id);

    if (id) {
      const { data: drug, error } = await supabase
        .from('drug')
        .select(DRUG_SELECT_QUERY)
        .eq('id', id)
        .single();

      if (error) {
        return handleSupabaseError(res, error, 'Drug not found');
      }

      return sendJson(res, drug as DrugResponseDto);
    }

    let drugsQuery = supabase.from('drug').select(DRUG_SELECT_QUERY);

    if (query && query.trim()) {
      drugsQuery = drugsQuery.ilike('name', `%${query}%`);
    }

    const { data: drugs, error } = await drugsQuery.order('id', {
      ascending: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedDrugs = (drugs as DrugResponseDto[]) || [];

    return sendJson(res, typedDrugs);
  } catch (error) {
    return handleError(res, error);
  }
}
