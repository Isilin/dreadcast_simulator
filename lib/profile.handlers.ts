import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchPseudo, sendCommunityError } from './community.api.js';
import type { ProfileResponseDto } from './community.types.js';
import { pseudoPayloadSchema } from './community.validation.js';
import { requireAuthenticatedUser, setNoStoreHeaders } from './helper.api.js';

/**
 * GET|PUT /api/profile/me — account pseudo. The pseudo is definitive: PUT
 * only creates it.
 */
export const handleProfile = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const context = await requireAuthenticatedUser(req, res);
  if (!context) {
    return;
  }

  const { supabase, userId } = context;
  const current = await fetchPseudo(supabase, userId);
  if (current.error) {
    return res.status(500).json({ error: current.error.message });
  }

  if (req.method === 'GET') {
    const payload: ProfileResponseDto = { pseudo: current.pseudo };
    setNoStoreHeaders(res);
    return res.status(200).json(payload);
  }

  if (current.pseudo) {
    return sendCommunityError(res, 'PSEUDO_ALREADY_SET');
  }

  const parsedPayload = pseudoPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return sendCommunityError(res, 'INVALID_PSEUDO');
  }

  const { data, error } = await supabase
    .from('user_profile')
    .insert({ user_id: userId, pseudo: parsedPayload.data.pseudo })
    .select('pseudo')
    .single();

  if (error) {
    if (error.code === '23505') {
      return sendCommunityError(
        res,
        error.message.includes('user_profile_pkey')
          ? 'PSEUDO_ALREADY_SET'
          : 'PSEUDO_TAKEN',
      );
    }

    if (error.code === '23514') {
      return sendCommunityError(res, 'INVALID_PSEUDO');
    }

    return res.status(500).json({ error: error.message });
  }

  const payload: ProfileResponseDto = {
    pseudo: (data as { pseudo: string }).pseudo,
  };
  setNoStoreHeaders(res);
  return res.status(201).json(payload);
};
