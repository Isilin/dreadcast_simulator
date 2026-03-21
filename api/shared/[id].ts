import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { doCreateClient, handleError } from '../../lib/helper.api.js';
import type { SharedBuildResponseDto } from '../../lib/shared.types.js';

const idSchema = z.uuid();

const setNoStoreHeaders = (res: VercelResponse): void => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
};

interface SharedBuildReferenceRow {
  build_id: string;
  created_at: string;
}

interface BuildSnapshotRow {
  id: string;
  user_id: string;
  snapshot: unknown;
  saved_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsedId = idSchema.safeParse(req.query.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Identifiant de partage invalide.' });
  }

  try {
    const supabase = doCreateClient();

    const { data: sharedBuild, error: sharedBuildError } = await supabase
      .from('shared_build')
      .select('build_id, created_at')
      .eq('id', parsedId.data)
      .maybeSingle();

    if (sharedBuildError) {
      return res.status(500).json({ error: sharedBuildError.message });
    }

    if (!sharedBuild) {
      return res.status(404).json({ error: 'Build partage introuvable.' });
    }

    const reference = sharedBuild as SharedBuildReferenceRow;

    const { data: build, error: buildError } = await supabase
      .from('build')
      .select('id, user_id, snapshot, saved_at')
      .eq('id', reference.build_id)
      .maybeSingle();

    if (buildError) {
      return res.status(500).json({ error: buildError.message });
    }

    if (!build) {
      return res.status(404).json({ error: 'Build source introuvable.' });
    }

    const buildSnapshot = build as BuildSnapshotRow;
    const { data: orderedBuilds, error: orderedBuildsError } = await supabase
      .from('build')
      .select('id')
      .eq('user_id', buildSnapshot.user_id)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    if (orderedBuildsError) {
      return res.status(500).json({ error: orderedBuildsError.message });
    }

    const orderedIds = (orderedBuilds ?? []) as Array<{ id: string }>;
    const slot = Math.max(
      1,
      orderedIds.findIndex((row) => row.id === buildSnapshot.id) + 1,
    );

    const parsedSnapshot =
      typeof buildSnapshot.snapshot === 'string'
        ? JSON.parse(buildSnapshot.snapshot)
        : buildSnapshot.snapshot;

    const responsePayload: SharedBuildResponseDto = {
      id: parsedId.data,
      slot,
      snapshot: parsedSnapshot,
      saved_at: buildSnapshot.saved_at,
      created_at: reference.created_at,
    };

    setNoStoreHeaders(res);
    return res.status(200).json(responsePayload);
  } catch (error) {
    return handleError(res, error, 'Erreur lecture partage build');
  }
}
