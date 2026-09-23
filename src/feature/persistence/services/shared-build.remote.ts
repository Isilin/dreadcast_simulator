import type { BuildSnapshot } from './persistence.service';

import { getAuthHeaders } from '@/feature/auth';

interface CreateSharedBuildLinkParams {
  slot: string;
}

export const createSharedBuildLink = async ({
  slot,
}: CreateSharedBuildLinkParams): Promise<string> => {
  const headers = await getAuthHeaders();
  const numericSlot = Number.parseInt(slot, 10);

  if (!Number.isInteger(numericSlot) || numericSlot <= 0) {
    throw new Error('Slot de build invalide.');
  }

  const response = await fetch('/api/shared', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      slot: numericSlot,
    }),
  });

  if (!response.ok) {
    throw new Error('Impossible de partager le build.');
  }

  const payload: unknown = await response.json();
  const { createSharedBuildResponseSchema } =
    await import('./persistence.schema');
  const parsed = createSharedBuildResponseSchema.parse(payload);

  return parsed.id;
};

interface FetchSharedBuildByIdParams {
  id: string;
  signal?: AbortSignal;
}

export const fetchSharedBuildById = async ({
  id,
  signal,
}: FetchSharedBuildByIdParams): Promise<BuildSnapshot> => {
  const response = await fetch(`/api/shared/${encodeURIComponent(id)}`, {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    throw new Error('Impossible de recuperer le build partage.');
  }

  const payload: unknown = await response.json();
  const { sharedBuildResponseSchema } = await import('./persistence.schema');
  const parsed = sharedBuildResponseSchema.parse(payload);
  const parsedSnapshot = parsed.snapshot as unknown as BuildSnapshot;

  return {
    ...parsedSnapshot,
    savedAt: new Date(parsed.saved_at).getTime(),
  };
};
