import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  createDrugClient,
  DRUG_SELECT_QUERY,
  setCacheHeaders,
  handleDrugError,
} from '../../lib/drug.api.ts';
import type { DrugResponseDto } from '../../lib/drug.types.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createDrugClient();
    const query = req.query.query as string | undefined;
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

    setCacheHeaders(res);
    return res.status(200).json(typedDrugs);
  } catch (error) {
    return handleDrugError(res, error);
  }
}
