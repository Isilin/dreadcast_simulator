import { useKitStore, useKitsActions } from './kit.store';
import type { KitsState } from './kit.types';

export const useKitsState = (): KitsState => useKitStore((s) => s.kits);

export const useKitsDispatch = () => useKitsActions();
