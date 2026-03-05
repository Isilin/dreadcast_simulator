import { useItemStore, useItemsActions } from './item.store';
import type { ItemsState } from './item.types';

export const useItemsState = (): ItemsState => useItemStore((s) => s.items);

export const useItemsDispatch = () => useItemsActions();
