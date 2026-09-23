import type { BuildSnapshot } from './persistence.service';

import { getAuthHeaders } from '@/feature/auth';

/**
 * Saves still in flight. A reload must not read the builds before they land,
 * otherwise an edit flushed on unmount would be overwritten by stale data.
 */
const pendingUpserts = new Set<Promise<unknown>>();

export const waitForPendingBuildSaves = async (): Promise<void> => {
  await Promise.allSettled([...pendingUpserts]);
};

export const fetchRemoteBuilds = async (
  signal?: AbortSignal,
): Promise<Record<string, BuildSnapshot>> => {
  await waitForPendingBuildSaves();

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
  const { remoteBuildArrayResponseSchema } =
    await import('./persistence.schema');
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

const sendUpsertRemoteBuild = async ({
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
  const { remoteBuildResponseDtoSchema } = await import('./persistence.schema');
  const parsed = remoteBuildResponseDtoSchema.parse(payload);
  const parsedSnapshot = parsed.snapshot as unknown as BuildSnapshot;

  return {
    ...parsedSnapshot,
    savedAt: new Date(parsed.saved_at).getTime(),
  };
};

export const upsertRemoteBuild = (
  params: UpsertRemoteBuildParams,
): Promise<BuildSnapshot> => {
  const request = sendUpsertRemoteBuild(params);
  pendingUpserts.add(request);
  void request
    .finally(() => pendingUpserts.delete(request))
    .catch(() => undefined);
  return request;
};
