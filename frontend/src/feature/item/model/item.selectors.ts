import { computeItemsEffect } from './item.rules';
import { useItemsState } from './item.store';

export const useItemsEffect = (): ReturnType<typeof computeItemsEffect> => {
  const state = useItemsState();
  return computeItemsEffect(state);
};
