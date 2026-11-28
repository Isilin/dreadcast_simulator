import type { BuildSnapshot } from './persistence.service';

import { requireSession } from '@/feature/auth';
import { callApi } from '@/utils/api-client';
import {
  createRepositoryErrorClass,
  RepositoryError,
} from '@/utils/repository-error';

const PersistenceRepositoryError = createRepositoryErrorClass(
  'PersistenceRepositoryError',
);

const invalidBuilds = {
  code: 'INVALID_REMOTE_BUILDS_PAYLOAD',
  message: 'Le format des builds distants est invalide.',
};

/** Slot of the store ('1', '2'...) as sent to the API. */
const toApiSlot = (slot: string): number => {
  const numericSlot = Number.parseInt(slot, 10);
  if (!Number.isInteger(numericSlot) || numericSlot <= 0) {
    throw new Error('Slot de build invalide.');
  }
  return numericSlot;
};

/**
 * Saves still in flight. A reload must not read the builds before they land,
 * otherwise an edit flushed on unmount would be overwritten by stale data.
 */
const pendingUpserts = new Set<Promise<unknown>>();

const waitForPendingBuildSaves = async (): Promise<void> => {
  await Promise.allSettled([...pendingUpserts]);
};

export const fetchRemoteBuilds = async (
  signal?: AbortSignal,
): Promise<Record<string, BuildSnapshot>> => {
  await waitForPendingBuildSaves();

  await requireSession();
  const builds = await callApi((client) => client.api.builds.$get(), {
    signal,
    ErrorClass: PersistenceRepositoryError,
    failed: {
      code: 'FETCH_REMOTE_BUILDS_FAILED',
      message: 'Impossible de recuperer les builds distants.',
    },
    invalid: invalidBuilds,
  });

  return Object.fromEntries(
    builds.map((entry) => {
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
  await requireSession();
  const numericSlot = toApiSlot(slot);
  const saved = await callApi(
    (client) =>
      client.api.builds.$put({
        json: {
          slot: numericSlot,
          snapshot: snapshot as unknown as Record<string, unknown>,
        },
      }),
    {
      ErrorClass: PersistenceRepositoryError,
      failed: {
        code: 'SAVE_REMOTE_BUILD_FAILED',
        message: 'Impossible de sauvegarder le build distant.',
      },
      invalid: invalidBuilds,
    },
  );

  return {
    ...(saved.snapshot as unknown as BuildSnapshot),
    savedAt: new Date(saved.saved_at).getTime(),
  };
};

/**
 * Deletes the build of a slot: the next slots move up. A build missing on the
 * server (never saved) counts as deleted.
 */
export const deleteRemoteBuild = async (slot: string): Promise<void> => {
  // A save still in flight would recreate the build after its deletion.
  await waitForPendingBuildSaves();

  await requireSession();
  const numericSlot = toApiSlot(slot);

  try {
    await callApi(
      (client) =>
        client.api.builds.$delete({ query: { slot: String(numericSlot) } }),
      {
        ErrorClass: PersistenceRepositoryError,
        failed: {
          code: 'DELETE_REMOTE_BUILD_FAILED',
          message: 'Impossible de supprimer le build distant.',
        },
        invalid: invalidBuilds,
      },
    );
  } catch (error) {
    if (!(error instanceof RepositoryError && error.status === 404)) {
      throw error;
    }
  }
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
