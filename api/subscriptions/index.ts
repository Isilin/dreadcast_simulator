import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  doCreateClientWithAuth,
  handleError,
  requireBearerToken,
} from '../../lib/helper.api.js';
import {
  SUBSCRIPTION_SELECT_QUERY,
  SUBSCRIPTION_PLAN_SELECT_QUERY,
  buildSubscriptionDateRange,
} from '../../lib/subscription.api.js';
import type {
  CreateSubscriptionRequestDto,
  SubscriptionPlanResponseDto,
  SubscriptionResponseDto,
} from '../../lib/subscription.types.js';

const createSubscriptionSchema = z.object({
  planCode: z.string().min(1),
});

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
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

    const userId = userData.user.id;

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('subscription')
        .select(SUBSCRIPTION_SELECT_QUERY)
        .eq('user_id', userId)
        .order('starts_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      setNoStoreHeaders(res);
      return res.status(200).json((data as SubscriptionResponseDto[]) ?? []);
    }

    const parsedPayload = createSubscriptionSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      return res.status(400).json({ error: 'Payload abonnement invalide.' });
    }

    const payload = parsedPayload.data as CreateSubscriptionRequestDto;
    const { data: planData, error: planError } = await supabase
      .from('subscription_plan')
      .select(SUBSCRIPTION_PLAN_SELECT_QUERY)
      .eq('code', payload.planCode)
      .eq('is_active', true)
      .single();

    if (planError || !planData) {
      return res.status(400).json({ error: 'Plan abonnement introuvable.' });
    }

    const plan = planData as SubscriptionPlanResponseDto;
    const { startsAt, endsAt } = buildSubscriptionDateRange(
      plan.duration_ingame_years,
    );

    const { data, error } = await supabase
      .from('subscription')
      .insert({
        user_id: userId,
        plan_code: plan.code,
        plan_name: plan.label,
        price_cents: plan.price_cents,
        starts_at: startsAt,
        ends_at: endsAt,
      })
      .select(SUBSCRIPTION_SELECT_QUERY)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    setNoStoreHeaders(res);
    return res.status(201).json(data as SubscriptionResponseDto);
  } catch (error) {
    return handleError(res, error, 'Erreur abonnement');
  }
}
