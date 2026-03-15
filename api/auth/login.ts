import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { doCreateClient, handleError } from '../../lib/helper.api.js';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const setAuthNoCacheHeaders = (res: VercelResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Payload de connexion invalide' });
    }

    const { email, password } = parsed.data;

    const supabase = doCreateClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res
        .status(401)
        .json({ error: error?.message ?? 'Connexion refusée' });
    }

    setAuthNoCacheHeaders(res);
    return res.status(200).json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (error) {
    return handleError(res, error, 'Erreur de connexion');
  }
}
