import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPseudo, fetchAccountProfile } from './account.repo';

import { useAuthState } from '@/feature/auth';

const PROFILE_STALE_TIME_MS = 10 * 60 * 1000;

const accountQueryKeys = {
  profile: (userId: string | null) => ['account', 'profile', userId] as const,
};

/**
 * Account profile of the signed-in user (disabled for guests).
 */
export const useAccountProfile = () => {
  const { session } = useAuthState();
  const userId = session?.user?.id ?? null;

  return useQuery({
    queryKey: accountQueryKeys.profile(userId),
    queryFn: ({ signal }) => fetchAccountProfile(signal),
    enabled: userId !== null,
    staleTime: PROFILE_STALE_TIME_MS,
  });
};

export const useCreatePseudo = () => {
  const queryClient = useQueryClient();
  const { session } = useAuthState();
  const userId = session?.user?.id ?? null;

  return useMutation({
    mutationFn: (pseudo: string) => createPseudo(pseudo),
    onSuccess: (profile) => {
      queryClient.setQueryData(accountQueryKeys.profile(userId), profile);
      // Pseudos are displayed on publications and reviews.
      return queryClient.invalidateQueries({ queryKey: ['community'] });
    },
  });
};
