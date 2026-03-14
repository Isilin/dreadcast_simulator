import { createClient } from '@supabase/supabase-js';
import type { VercelResponse } from '@vercel/node';

export const doCreateClient = () =>
  createClient(
    process.env.SIMULATOR_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY || '',
  );

export const setCacheHeaders = (res: VercelResponse): void => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=86400',
  );
  res.setHeader('Content-Type', 'application/json');
};

export const handleError = (
  res: VercelResponse,
  error: unknown,
  defaultMessage = 'Unknown error',
) => {
  if (error instanceof Error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(500).json({ error: defaultMessage });
};
