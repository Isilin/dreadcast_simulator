import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl =
  process.env.SIMULATOR_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_URL ||
  '';
const supabaseAnonKey =
  process.env.SIMULATOR_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SIMULATOR_SUPABASE_ANON_KEY ||
  '';

export const doCreateClient = () => createClient(supabaseUrl, supabaseAnonKey);

export const doCreateClientWithAuth = (accessToken: string) =>
  createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

export const requireBearerToken = (
  req: VercelRequest,
  res: VercelResponse,
): string | null => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ error: 'Utilisateur non authentifie.' });
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    res.status(401).json({ error: "Jeton d'authentification invalide." });
    return null;
  }

  return token;
};

export const setCacheHeaders = (res: VercelResponse): void => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=86400',
  );
  res.setHeader('Content-Type', 'application/json');
};

export const sendJson = (res: VercelResponse, data: unknown) => {
  setCacheHeaders(res);
  return res.status(200).json(data);
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

export const handleSupabaseError = (
  res: VercelResponse,
  error: { code: string; message: string },
  notFoundMessage: string,
) => {
  if (error.code === 'PGRST116') {
    return res.status(404).json({ error: notFoundMessage });
  }
  return res.status(500).json({ error: error.message });
};

export const requireStringParam = (
  param: string | string[] | undefined,
  res: VercelResponse,
  errorMessage: string,
): string | null => {
  if (!param || typeof param !== 'string') {
    res.status(400).json({ error: errorMessage });
    return null;
  }
  return param;
};
