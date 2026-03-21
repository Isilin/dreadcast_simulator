import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  doCreateClientWithAuth,
  handleError,
  requireBearerToken,
} from '../../lib/helper.api.js';
import { SHARED_BUILD_SELECT_QUERY } from '../../lib/shared.api.js';
import type {
  CreateSharedBuildRequestDto,
  SharedBuildLinkResponseDto,
} from '../../lib/shared.types.js';

const createSharedBuildSchema = z.object({
  slot: z.coerce.number().int().min(1),
});

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

interface SharedBuildRow {
  id: string;
  build_id: string;
  created_at: string;
}

const toResponseDto = (
  row: SharedBuildRow,
  slot: number,
): SharedBuildLinkResponseDto => ({
  id: row.id,
  slot,
  created_at: row.created_at,
});

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

    const userId = userData.user.id;
    const parsedPayload = createSharedBuildSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      return res.status(400).json({ error: 'Payload partage invalide.' });
    }

    const payload = parsedPayload.data as CreateSharedBuildRequestDto;

    const nowIso = new Date().toISOString();
    const { data: activeSubscription, error: subscriptionError } =
      await supabase
        .from('subscription')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'validated')
        .gte('ends_at', nowIso)
        .limit(1)
        .maybeSingle();

    if (subscriptionError) {
      return res.status(500).json({ error: subscriptionError.message });
    }

    if (!activeSubscription) {
      return res.status(403).json({ error: 'Abonnement valide requis.' });
    }

    const { data: orderedBuilds, error: buildError } = await supabase
      .from('build')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    if (buildError) {
      return res.status(500).json({ error: buildError.message });
    }

    const slotIndex = payload.slot - 1;
    const buildRow = ((orderedBuilds ?? []) as Array<{ id: string }>)[
      slotIndex
    ];

    if (!buildRow) {
      return res.status(404).json({ error: 'Build introuvable pour ce slot.' });
    }

    const { data, error } = await supabase
      .from('shared_build')
      .upsert(
        {
          build_id: buildRow.id,
          updated_at: nowIso,
        },
        {
          onConflict: 'build_id',
        },
      )
      .select(SHARED_BUILD_SELECT_QUERY)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    setNoStoreHeaders(res);
    return res
      .status(200)
      .json(toResponseDto(data as SharedBuildRow, payload.slot));
  } catch (error) {
    return handleError(res, error, 'Erreur partage build');
  }
}
