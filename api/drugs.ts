import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { DrugResponseDto } from './lib/drug.types.ts';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: drugs, error } = await supabase
      .from('drug')
      .select(
        `
        id,
        name,
        image,
        stat_modifier (
          property,
          value
        )
      `,
      )
      .order('id', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const typedDrugs = (drugs as DrugResponseDto[]) || [];

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400',
    );
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(typedDrugs);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
