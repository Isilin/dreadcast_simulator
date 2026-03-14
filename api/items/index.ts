import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClient,
  handleError,
  setCacheHeaders,
} from '../../lib/helper.api.ts';
import { ITEM_SELECT_QUERY } from '../../lib/item.api.ts';
import type { ItemResponseDto } from '../../lib/item.types.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = doCreateClient();
    const query = req.query.query as string | undefined;
    const typeParam = req.query.type as string | undefined;

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

    setCacheHeaders(res);
    return res.status(200).json(typedItems);
  } catch (error) {
    return handleError(res, error);
  }
}
