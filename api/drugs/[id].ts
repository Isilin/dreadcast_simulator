import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { DrugResponseDto } from '../lib/drug.types.ts';

const supabase = createClient(
  process.env.SIMULATOR_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY || '',
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Drug ID is required' });
  }

  try {
    const { data: drug, error } = await supabase
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
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Drug not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    const typedDrug = (drug as DrugResponseDto) || null;

    if (!typedDrug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400',
    );
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(typedDrug);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
