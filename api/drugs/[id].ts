import type { VercelRequest, VercelResponse } from '@vercel/node';

import { DRUG_SELECT_QUERY, typeDrug } from '../../lib/drug.api';
import {
  doCreateClient,
  handleError,
  handleSupabaseError,
  requireStringParam,
  sendJson,
} from '../../lib/helper.api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = requireStringParam(req.query.id, res, 'Drug ID is required');
  if (!id) return;

  try {
    const supabase = doCreateClient();
    const { data: drug, error } = await supabase
      .from('drug')
      .select(DRUG_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(res, error, 'Drug not found');

    const typedDrug = typeDrug(drug);

    if (!typedDrug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    return sendJson(res, typedDrug);
  } catch (error) {
    return handleError(res, error);
  }
}
