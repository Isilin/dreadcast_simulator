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

export type AuthenticatedSupabaseClient = ReturnType<
  typeof doCreateClientWithAuth
>;

export interface AuthenticatedContext {
  supabase: AuthenticatedSupabaseClient;
  userId: string;
}

/**
 * Validates the bearer token and resolves the Supabase user. Sends the 401
 * response itself and returns null when the request is not authenticated.
 */
export const requireAuthenticatedUser = async (
  req: VercelRequest,
  res: VercelResponse,
): Promise<AuthenticatedContext | null> => {
  const accessToken = requireBearerToken(req, res);
  if (!accessToken) {
    return null;
  }

  const supabase = doCreateClientWithAuth(accessToken);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    res.status(401).json({ error: 'Utilisateur non authentifie.' });
    return null;
  }

  return { supabase, userId: data.user.id };
};

export const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
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

export const getOptionalStringParam = (
  param: string | string[] | undefined,
): string | undefined => {
  if (typeof param === 'string') {
    const value = param.trim();
    return value.length > 0 ? value : undefined;
  }

  if (Array.isArray(param)) {
    const firstValue = param.find(
      (entry) => typeof entry === 'string' && entry.trim().length > 0,
    );

    return firstValue?.trim();
  }

  return undefined;
};
