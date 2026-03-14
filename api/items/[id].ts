import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { ITEM_SELECT_QUERY, typeItem } from '../../lib/item.api.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  try {
    const supabase = doCreateClient();
    const { data: item, error } = await supabase
      .from('item')
      .select(ITEM_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Item not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedItem = typeItem(item);

    if (!typedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    setCacheHeaders(res);
    return res.status(200).json(typedItem);
  } catch (error) {
    return handleError(res, error);
  }
}
