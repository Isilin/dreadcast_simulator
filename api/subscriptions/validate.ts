import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  doCreateClientWithAuth,
  handleError,
  requireBearerToken,
} from '../../lib/helper.api.js';
import { SUBSCRIPTION_SELECT_QUERY } from '../../lib/subscription.api.js';
import type {
  SubscriptionResponseDto,
  ValidateSubscriptionRequestDto,
} from '../../lib/subscription.types.js';

const validateSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid(),
});

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

const isAdminUser = (user: { app_metadata: unknown }): boolean => {
  const appMetadata = user.app_metadata as { role?: unknown } | null;
  return appMetadata?.role === 'admin';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = requireBearerToken(req, res);
  if (!accessToken) {
    return;
  }

  try {
    const supabase = doCreateClientWithAuth(accessToken);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifie.' });
    }

    if (!isAdminUser(userData.user)) {
      return res
        .status(403)
        .json({ error: 'Action reservee aux administrateurs.' });
    }

    const parsedPayload = validateSubscriptionSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      return res
        .status(400)
        .json({ error: 'Payload de validation abonnement invalide.' });
    }

    const payload = parsedPayload.data as ValidateSubscriptionRequestDto;

    const { data, error } = await supabase
      .from('subscription')
      .update({
        status: 'validated',
        validated_at: new Date().toISOString(),
        validated_by: userData.user.id,
      })
      .eq('id', payload.subscriptionId)
      .eq('status', 'pending')
      .select(SUBSCRIPTION_SELECT_QUERY)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: 'Abonnement introuvable ou deja valide.' });
    }

    setNoStoreHeaders(res);
    return res.status(200).json(data as SubscriptionResponseDto);
  } catch (error) {
    return handleError(res, error, 'Erreur validation abonnement');
  }
}
