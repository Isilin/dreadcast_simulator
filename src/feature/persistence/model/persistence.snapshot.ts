import {
  getDefaultBuildName,
  restoreItems,
  restoreKits,
  serializeItems,
  serializeKits,
  type BuildSnapshot,
} from '../services/persistence.service';

import {
  initialState as drugsInitialState,
  useDrugStore,
} from '@/feature/drug/model/drug.store';
import {
  initialState as implantsInitialState,
  useImplantStore,
} from '@/feature/implant/model/implant.store';
import type { Item } from '@/feature/item';
import {
  initialState as itemsInitialState,
  useItemStore,
} from '@/feature/item/model/item.store';
import type { Kit } from '@/feature/kit';
import {
  initialState as kitsInitialState,
  useKitStore,
} from '@/feature/kit/model/kit.store';
import {
  initialState as profileInitialState,
  useProfileStore,
} from '@/feature/profile/model/profile.store';

export interface BuildStoreState {
  profile: typeof profileInitialState;
  implants: typeof implantsInitialState;
  items: typeof itemsInitialState;
  kits: typeof kitsInitialState;
  drug: typeof drugsInitialState;
}

export const readBuildStoreState = (): BuildStoreState => ({
  profile: useProfileStore.getState().profile,
  implants: useImplantStore.getState().implants,
  items: useItemStore.getState().items,
  kits: useKitStore.getState().kits,
  drug: useDrugStore.getState().drug,
});

export const createBuildSnapshot = (
  slot: string,
  state: BuildStoreState,
  previousBuild?: BuildSnapshot,
): BuildSnapshot => ({
  profile: state.profile,
  implants: state.implants,
  items: serializeItems(state.items),
  kits: serializeKits(state.kits),
  drug: state.drug,
  name: previousBuild?.name ?? getDefaultBuildName(slot),
  savedAt: Date.now(),
});

export const restoreBuildToStores = (
  build: BuildSnapshot,
  allItems: Item[],
  allKits: Kit[],
): void => {
  useProfileStore.getState().replaceProfile(build.profile);
  useImplantStore.getState().replaceImplants(build.implants);
  useItemStore.getState().replaceItems(restoreItems(build.items, allItems));
  useKitStore.getState().replaceKits(restoreKits(build.kits, allKits));
  useDrugStore.getState().replaceDrug(build.drug ?? drugsInitialState);
};

export const resetBuildStores = (): void => {
  useProfileStore.getState().replaceProfile(profileInitialState);
  useImplantStore.getState().replaceImplants(implantsInitialState);
  useItemStore.getState().replaceItems(itemsInitialState);
  useKitStore.getState().replaceKits(kitsInitialState);
  useDrugStore.getState().replaceDrug(drugsInitialState);
};
