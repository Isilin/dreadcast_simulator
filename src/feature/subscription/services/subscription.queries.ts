import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createSubscription,
  fetchSubscriptionPlans,
  fetchSubscriptions,
} from './subscription.repo';
import type { SubscriptionPlanCode } from '../model';

const SUBSCRIPTION_STALE_TIME_MS = 60 * 1000;

export const subscriptionQueryKeys = {
  all: ['subscriptions'] as const,
  plans: ['subscription-plans'] as const,
};

export const useSubscriptions = () =>
  useQuery({
    queryKey: subscriptionQueryKeys.all,
    queryFn: ({ signal }) => fetchSubscriptions(signal),
    staleTime: SUBSCRIPTION_STALE_TIME_MS,
  });

export const useSubscriptionPlans = () =>
  useQuery({
    queryKey: subscriptionQueryKeys.plans,
    queryFn: ({ signal }) => fetchSubscriptionPlans(signal),
    staleTime: SUBSCRIPTION_STALE_TIME_MS,
  });

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planCode: SubscriptionPlanCode) =>
      createSubscription(planCode),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: subscriptionQueryKeys.all,
      });
    },
  });
};
