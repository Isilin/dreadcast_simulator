import {
  SUBSCRIPTION_REPOSITORY_ERROR_CODE,
  SubscriptionRepositoryError,
} from './subscription.errors';
import { toDomain, toPlanDomain } from './subscription.mapper';
import {
  subscriptionPlanArrayResponseDtoSchema,
  subscriptionArrayResponseDtoSchema,
  subscriptionResponseDtoSchema,
} from './subscription.schema';
import type {
  SubscriptionPlan,
  SubscriptionPlanCode,
  SubscriptionRecord,
} from '../model';

import { getCurrentSession } from '@/feature/auth';
import { validatePayload } from '@/utils/validation';

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new SubscriptionRepositoryError({
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
      message: 'Session utilisateur manquante.',
      status: 401,
    });
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const fetchSubscriptions = async (
  signal?: AbortSignal,
): Promise<SubscriptionRecord[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/subscriptions', {
    method: 'GET',
    headers,
    signal,
  });

  if (!response.ok) {
    throw new SubscriptionRepositoryError({
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.FETCH_SUBSCRIPTIONS_FAILED,
      message: 'Impossible de recuperer les abonnements.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const subscriptions = validatePayload({
    schema: subscriptionArrayResponseDtoSchema,
    payload,
    errorCode: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTIONS_PAYLOAD,
    errorMessage: 'Le format des abonnements recus est invalide.',
  });

  return subscriptions.map(toDomain);
};

export const fetchSubscriptionPlans = async (
  signal?: AbortSignal,
): Promise<SubscriptionPlan[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/subscription-plans', {
    method: 'GET',
    headers,
    signal,
  });

  if (!response.ok) {
    throw new SubscriptionRepositoryError({
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.FETCH_SUBSCRIPTION_PLANS_FAILED,
      message: 'Impossible de recuperer les plans abonnement.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const plans = validatePayload({
    schema: subscriptionPlanArrayResponseDtoSchema,
    payload,
    errorCode:
      SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTION_PLANS_PAYLOAD,
    errorMessage: 'Le format des plans abonnement recus est invalide.',
  });

  return plans.map(toPlanDomain);
};

export const createSubscription = async (
  planCode: SubscriptionPlanCode,
): Promise<SubscriptionRecord> => {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers,
    body: JSON.stringify({ planCode }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new SubscriptionRepositoryError({
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.CREATE_SUBSCRIPTION_FAILED,
      message: body?.error ?? 'Impossible de creer cet abonnement.',
      status: response.status,
    });
  }

  const payload: unknown = await response.json();
  const subscription = validatePayload({
    schema: subscriptionResponseDtoSchema,
    payload,
    errorCode: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTION_PAYLOAD,
    errorMessage: 'Le format de l abonnement recu est invalide.',
  });

  return toDomain(subscription);
};
