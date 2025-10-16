import { useItemsState } from './item.hooks';
import { computeItemsEffect } from './item.rules';

export const useItemsEffect = (): ReturnType<typeof computeItemsEffect> => {
  const state = useItemsState();
  return computeItemsEffect(state);
};
