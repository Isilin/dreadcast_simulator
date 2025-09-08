import { useSuitContext } from '../providers/suit.provider';

export const useSuit = () => {
  const data = useSuitContext();
  return { ...data };
};
