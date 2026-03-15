import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  getOptionalStringParam,
  handleError,
  handleSupabaseError,
  sendJson,
} from '../../lib/helper.api.js';
import { ITEM_SELECT_QUERY } from '../../lib/item.api.js';
import type { ItemResponseDto } from '../../lib/item.types.js';

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
      const { data: item, error } = await supabase
        .from('item')
        .select(ITEM_SELECT_QUERY)
        .eq('id', id)
        .single();

      if (error) {
        return handleSupabaseError(res, error, 'Item not found');
      }

      return sendJson(res, item as ItemResponseDto);
    }

    let itemsQuery = supabase.from('item').select(ITEM_SELECT_QUERY);

    if (query && query.trim()) {
      itemsQuery = itemsQuery.ilike('name', `%${query}%`);
    }

    if (typeParam && typeParam.trim()) {
      const types = typeParam.split(',').map((t) => t.trim());
      itemsQuery = itemsQuery.in('type', types);
    }

    const { data: items, error } = await itemsQuery.order('name', {
      ascending: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedItems = (items as ItemResponseDto[]) || [];

    return sendJson(res, typedItems);
  } catch (error) {
    return handleError(res, error);
  }
}
