import type { VercelRequest, VercelResponse } from '@vercel/node';

import { doCreateClient, handleError, sendJson } from '../../lib/helper.api.js';
import { ITEM_SELECT_QUERY } from '../../lib/item.api.js';
import type { ItemResponseDto } from '../../lib/item.types.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const { data: items, error } = await supabase
      .from('item')
      .select(ITEM_SELECT_QUERY)
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedItems = (items as unknown as ItemResponseDto[]) || [];

    return sendJson(res, typedItems);
  } catch (error) {
    return handleError(res, error);
  }
}
