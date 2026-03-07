import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createDrugClient,
  DRUG_SELECT_QUERY,
  setCacheHeaders,
  handleDrugError,
  typeDrug,
} from '../lib/drug.api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Drug ID is required' });
  }

  try {
    const supabase = createDrugClient();
    const { data: drug, error } = await supabase
      .from('drug')
      .select(DRUG_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Drug not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedDrug = typeDrug(drug);

    if (!typedDrug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    setCacheHeaders(res);
    return res.status(200).json(typedDrug);
  } catch (error) {
    return handleDrugError(res, error);
  }
}
