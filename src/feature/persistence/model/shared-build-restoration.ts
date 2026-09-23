import { restoreBuildToStores } from './persistence.snapshot';
import type { BuildSnapshot } from '../services/persistence.service';

import type { Item } from '@/feature/item';
import type { Kit } from '@/feature/kit';

export const restoreSharedBuild = (
  build: BuildSnapshot,
  allItems: Item[],
  allKits: Kit[],
): void => restoreBuildToStores(build, allItems, allKits);
