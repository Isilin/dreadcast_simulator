import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  doCreateClientWithAuth,
  handleError,
  requireBearerToken,
} from '../../lib/helper.api.js';
import { SUBSCRIPTION_PLAN_SELECT_QUERY } from '../../lib/subscription.api.js';
import type { SubscriptionPlanResponseDto } from '../../lib/subscription.types.js';

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
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

    const { data, error } = await supabase
      .from('subscription_plan')
      .select(SUBSCRIPTION_PLAN_SELECT_QUERY)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    setNoStoreHeaders(res);
    return res.status(200).json((data as SubscriptionPlanResponseDto[]) ?? []);
  } catch (error) {
    return handleError(res, error, 'Erreur plans abonnement');
  }
}
