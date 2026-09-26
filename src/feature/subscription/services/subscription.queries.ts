import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  createSubscription,
  fetchSubscriptionPlans,
  fetchSubscriptions,
} from './subscription.repo';
import {
  getActiveSubscription,
  type SubscriptionPlanCode,
  type SubscriptionRecord,
} from '../model';

import { useAuthState } from '@/feature/auth';

const SUBSCRIPTION_STALE_TIME_MS = 60 * 1000;

interface SubscriptionQueryOptions {
  enabled?: boolean;
}

const subscriptionQueryKeys = {
  all: ['subscriptions'] as const,
  plans: ['subscription-plans'] as const,
};

export const useSubscriptions = (options?: SubscriptionQueryOptions) =>
  useQuery({
    queryKey: subscriptionQueryKeys.all,
    queryFn: ({ signal }) => fetchSubscriptions(signal),
    staleTime: SUBSCRIPTION_STALE_TIME_MS,
    enabled: options?.enabled,
  });

export interface ActiveSubscriptionState {
  isAuthenticated: boolean;
  isSubscriber: boolean;
  activeSubscription: SubscriptionRecord | undefined;
  /** Auth bootstrap or first subscription fetch still in progress. */
  isLoading: boolean;
}

/**
 * Single source of truth for "is the current user an active subscriber".
 */
export const useActiveSubscription = (): ActiveSubscriptionState => {
  const { session, isBootstrapping } = useAuthState();
  const isAuthenticated = Boolean(session?.user);
  const { data: subscriptions, isPending } = useSubscriptions({
    enabled: isAuthenticated,
  });

  return useMemo(() => {
    const activeSubscription = getActiveSubscription(subscriptions ?? []);

    return {
      isAuthenticated,
      isSubscriber: activeSubscription !== undefined,
      activeSubscription,
      isLoading: isBootstrapping || (isAuthenticated && isPending),
    };
  }, [isAuthenticated, isBootstrapping, isPending, subscriptions]);
};

export const useSubscriptionPlans = (options?: SubscriptionQueryOptions) =>
  useQuery({
    queryKey: subscriptionQueryKeys.plans,
    queryFn: ({ signal }) => fetchSubscriptionPlans(signal),
    staleTime: SUBSCRIPTION_STALE_TIME_MS,
    enabled: options?.enabled,
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
