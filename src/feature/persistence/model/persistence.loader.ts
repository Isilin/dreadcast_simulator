import {
  fetchRemoteBuilds,
  upsertRemoteBuild,
} from '../services/persistence.remote';
import type {
  BuildSnapshot,
  BuildStorageMode,
} from '../services/persistence.service';
import {
  clearLocalBuilds,
  readBuilds,
  writeBuilds,
} from '../services/persistence.service';

interface LoadBuildsParams {
  mode: BuildStorageMode;
  previousMode: BuildStorageMode | null;
  inMemorySlot1?: BuildSnapshot;
}

export const loadBuilds = async ({
  mode,
  previousMode,
  inMemorySlot1,
}: LoadBuildsParams): Promise<Record<string, BuildSnapshot>> => {
  if (mode === 'local') {
    if (previousMode === 'remote' && inMemorySlot1) {
      writeBuilds({ ...readBuilds(), '1': inMemorySlot1 });
    }

    const guestBuild = readBuilds()['1'];
    return guestBuild ? { '1': guestBuild } : {};
  }

  const remoteBuilds = await fetchRemoteBuilds();
  const localBuild = readBuilds()['1'];

  if (!remoteBuilds['1'] && localBuild) {
    try {
      remoteBuilds['1'] = await upsertRemoteBuild({
        slot: '1',
        snapshot: localBuild,
      });
    } catch {}
  }

  clearLocalBuilds();
  return remoteBuilds;
};
