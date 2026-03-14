import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  handleSupabaseError,
  requireStringParam,
  sendJson,
} from '../../lib/helper.api.ts';
import { ITEM_SELECT_QUERY, typeItem } from '../../lib/item.api.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = requireStringParam(req.query.id, res, 'Item ID is required');
  if (!id) return;

  try {
    const supabase = doCreateClient();
    const { data: item, error } = await supabase
      .from('item')
      .select(ITEM_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) return handleSupabaseError(res, error, 'Item not found');

    const typedItem = typeItem(item);

    if (!typedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return sendJson(res, typedItem);
  } catch (error) {
    return handleError(res, error);
  }
}
