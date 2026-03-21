import z from 'zod';

import type { BuildSnapshot } from './persistence.service';

import { getCurrentSession } from '@/feature/auth';

const remoteBuildResponseSchema = z.object({
  slot: z.coerce.number().int().min(1),
  snapshot: z.record(z.string(), z.unknown()),
  saved_at: z.string().min(1),
});

const remoteBuildArrayResponseSchema = z.array(remoteBuildResponseSchema);

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('Session utilisateur manquante.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const fetchRemoteBuilds = async (
  signal?: AbortSignal,
): Promise<Record<string, BuildSnapshot>> => {
  const headers = await getAuthHeaders();
  const response = await fetch('/api/builds', {
    method: 'GET',
    headers,
    signal,
  });

  if (!response.ok) {
    throw new Error('Impossible de recuperer les builds distants.');
  }

  const payload: unknown = await response.json();
  const parsed = remoteBuildArrayResponseSchema.parse(payload);

  return Object.fromEntries(
    parsed.map((entry) => {
      const snapshot = entry.snapshot as unknown as BuildSnapshot;
      return [
        String(entry.slot),
        {
          ...snapshot,
          savedAt: new Date(entry.saved_at).getTime(),
        },
      ];
    }),
  );
};

interface UpsertRemoteBuildParams {
  slot: string;
  snapshot: BuildSnapshot;
}

export const upsertRemoteBuild = async ({
  slot,
  snapshot,
}: UpsertRemoteBuildParams): Promise<BuildSnapshot> => {
  const headers = await getAuthHeaders();
  const numericSlot = Number.parseInt(slot, 10);

  if (!Number.isInteger(numericSlot) || numericSlot <= 0) {
    throw new Error('Slot de build invalide.');
  }

  const response = await fetch('/api/builds', {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      slot: numericSlot,
      snapshot,
    }),
  });

  if (!response.ok) {
    throw new Error('Impossible de sauvegarder le build distant.');
  }

  const payload: unknown = await response.json();
  const parsed = remoteBuildResponseSchema.parse(payload);
  const parsedSnapshot = parsed.snapshot as unknown as BuildSnapshot;

  return {
    ...parsedSnapshot,
    savedAt: new Date(parsed.saved_at).getTime(),
  };
};
