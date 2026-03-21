import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { BUILD_SELECT_QUERY } from '../../lib/build.api.js';
import type {
  BuildResponseDto,
  UpsertBuildRequestDto,
} from '../../lib/build.types.js';
import {
  doCreateClientWithAuth,
  handleError,
  requireBearerToken,
} from '../../lib/helper.api.js';

const upsertBuildSchema = z.object({
  slot: z.coerce.number().int().min(1),
  snapshot: z.record(z.string(), z.unknown()),
});

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

interface BuildRow {
  id: string;
  user_id: string;
  snapshot: unknown;
  saved_at: string;
  created_at: string;
}

const toResponseDto = (row: BuildRow, slot: number): BuildResponseDto => ({
  slot,
  snapshot: row.snapshot,
  saved_at: row.saved_at,
});

const fetchOrderedBuilds = async (
  supabase: ReturnType<typeof doCreateClientWithAuth>,
  userId: string,
) => {
  const { data, error } = await supabase
    .from('build')
    .select(BUILD_SELECT_QUERY)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  return {
    data: (data ?? []) as BuildRow[],
    error,
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
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
      const { data, error } = await fetchOrderedBuilds(supabase, userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      setNoStoreHeaders(res);
      return res
        .status(200)
        .json(data.map((row, index) => toResponseDto(row, index + 1)));
    }

    const parsedPayload = upsertBuildSchema.safeParse(req.body);
    if (!parsedPayload.success) {
      return res.status(400).json({ error: 'Payload build invalide.' });
    }

    const payload = parsedPayload.data as UpsertBuildRequestDto;
    const savedAt = new Date().toISOString();
    const { data: orderedBuilds, error: orderedBuildsError } =
      await fetchOrderedBuilds(supabase, userId);

    if (orderedBuildsError) {
      return res.status(500).json({ error: orderedBuildsError.message });
    }

    const targetIndex = payload.slot - 1;
    const targetBuild = orderedBuilds[targetIndex] ?? null;

    if (targetBuild) {
      const { data, error } = await supabase
        .from('build')
        .update({
          snapshot: payload.snapshot,
          saved_at: savedAt,
        })
        .eq('id', targetBuild.id)
        .eq('user_id', userId)
        .select(BUILD_SELECT_QUERY)
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      setNoStoreHeaders(res);
      return res
        .status(200)
        .json(toResponseDto(data as BuildRow, targetIndex + 1));
    }

    const { data, error } = await supabase
      .from('build')
      .insert({
        user_id: userId,
        snapshot: payload.snapshot,
        saved_at: savedAt,
      })
      .select(BUILD_SELECT_QUERY)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    setNoStoreHeaders(res);
    return res
      .status(200)
      .json(toResponseDto(data as BuildRow, orderedBuilds.length + 1));
  } catch (error) {
    return handleError(res, error, 'Erreur builds');
  }
}
