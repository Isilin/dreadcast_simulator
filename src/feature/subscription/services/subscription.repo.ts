import {
  SUBSCRIPTION_REPOSITORY_ERROR_CODE,
  SubscriptionRepositoryError,
} from './subscription.errors';
import { toDomain, toPlanDomain } from './subscription.mapper';
import type {
  SubscriptionPlan,
  SubscriptionPlanCode,
  SubscriptionRecord,
} from '../model';

import { requireSession } from '@/feature/auth';
import { callApi } from '@/utils/api-client';

const ensureSession = (): Promise<void> =>
  requireSession(
    () =>
      new SubscriptionRepositoryError({
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.MISSING_AUTH_SESSION,
        message: 'Session utilisateur manquante.',
        status: 401,
      }),
  );

export const fetchSubscriptions = async (
  signal?: AbortSignal,
): Promise<SubscriptionRecord[]> => {
  await ensureSession();
  const subscriptions = await callApi(
    (client) => client.api.subscriptions.$get(),
    {
      signal,
      ErrorClass: SubscriptionRepositoryError,
      failed: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.FETCH_SUBSCRIPTIONS_FAILED,
        message: 'Impossible de recuperer les abonnements.',
      },
      invalid: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTIONS_PAYLOAD,
        message: 'Le format des abonnements recus est invalide.',
      },
    },
  );

  return subscriptions.map(toDomain);
};

export const fetchSubscriptionPlans = async (
  signal?: AbortSignal,
): Promise<SubscriptionPlan[]> => {
  await ensureSession();
  const plans = await callApi(
    (client) => client.api['subscription-plans'].$get(),
    {
      signal,
      ErrorClass: SubscriptionRepositoryError,
      failed: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.FETCH_SUBSCRIPTION_PLANS_FAILED,
        message: 'Impossible de recuperer les plans abonnement.',
      },
      invalid: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTION_PLANS_PAYLOAD,
        message: 'Le format des plans abonnement recus est invalide.',
      },
    },
  );

  return plans.map(toPlanDomain);
};

export const createSubscription = async (
  planCode: SubscriptionPlanCode,
): Promise<SubscriptionRecord> => {
  await ensureSession();
  const subscription = await callApi(
    (client) => client.api.subscriptions.$post({ json: { planCode } }),
    {
      ErrorClass: SubscriptionRepositoryError,
      failed: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.CREATE_SUBSCRIPTION_FAILED,
        message: 'Impossible de creer cet abonnement.',
      },
      invalid: {
        code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTION_PAYLOAD,
        message: 'Le format de l abonnement recu est invalide.',
      },
      apiMessage: true,
    },
  );

  return toDomain(subscription);
};
