import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  doCreateClient,
  handleError,
  requireAuthenticatedUser,
  setNoStoreHeaders,
} from '../../lib/helper.api.js';
import { SHARED_BUILD_SELECT_QUERY } from '../../lib/shared.api.js';
import type {
  CreateSharedBuildRequestDto,
  SharedBuildLinkResponseDto,
  SharedBuildResponseDto,
} from '../../lib/shared.types.js';
import { fetchHasActiveSubscription } from '../../lib/subscription.api.js';

const createSharedBuildSchema = z.object({
  slot: z.coerce.number().int().min(1),
});

const idSchema = z.uuid();

interface SharedBuildRow {
  id: string;
  build_id: string;
  created_at: string;
}

interface SharedBuildRpcRow {
  id: string;
  slot: number;
  snapshot: unknown;
  saved_at: string;
  created_at: string;
}

const toLinkResponseDto = (
  row: SharedBuildRow,
  slot: number,
): SharedBuildLinkResponseDto => ({
  id: row.id,
  slot,
  created_at: row.created_at,
});

/**
 * GET /api/shared/:id (rewritten to ?id=) — public read through the
 * get_shared_build RPC, which never exposes the owner.
 */
const handleRead = async (req: VercelRequest, res: VercelResponse) => {
  const parsedId = idSchema.safeParse(req.query.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Identifiant de partage invalide.' });
  }

  const supabase = doCreateClient();
  const { data, error } = await supabase
    .rpc('get_shared_build', { p_id: parsedId.data })
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Build partage introuvable.' });
  }

  const row = data as SharedBuildRpcRow;
  const responsePayload: SharedBuildResponseDto = {
    id: row.id,
    slot: row.slot,
    snapshot:
      typeof row.snapshot === 'string'
        ? JSON.parse(row.snapshot)
        : row.snapshot,
    saved_at: row.saved_at,
    created_at: row.created_at,
  };

  setNoStoreHeaders(res);
  return res.status(200).json(responsePayload);
};

/**
 * POST /api/shared — creates (or returns) the share link of one of the
 * subscriber's build slots.
 */
const handleCreate = async (req: VercelRequest, res: VercelResponse) => {
  const context = await requireAuthenticatedUser(req, res);
  if (!context) {
    return;
  }

  const { supabase, userId } = context;
  const parsedPayload = createSharedBuildSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return res.status(400).json({ error: 'Payload partage invalide.' });
  }

  const payload = parsedPayload.data as CreateSharedBuildRequestDto;

  const subscription = await fetchHasActiveSubscription(supabase, userId);
  if (subscription.error) {
    return res.status(500).json({ error: subscription.error.message });
  }

  if (!subscription.isActive) {
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
  const buildRow = ((orderedBuilds ?? []) as Array<{ id: string }>)[slotIndex];

  if (!buildRow) {
    return res.status(404).json({ error: 'Build introuvable pour ce slot.' });
  }

  const { data, error } = await supabase
    .from('shared_build')
    .upsert(
      {
        build_id: buildRow.id,
        user_id: userId,
        updated_at: new Date().toISOString(),
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
    .json(toLinkResponseDto(data as SharedBuildRow, payload.slot));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      return await handleRead(req, res);
    }

    if (req.method === 'POST') {
      return await handleCreate(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleError(res, error, 'Erreur partage build');
  }
}
