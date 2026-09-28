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

import { getAccessToken as getSessionToken } from '@/feature/auth';

const loadApi = () => import('@/utils/api-client');

const getAccessToken = (): Promise<string> =>
  getSessionToken(
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
  const accessToken = await getAccessToken();
  const { callApi } = await loadApi();
  const subscriptions = await callApi(
    (client) => client.subscriptions.listMine(),
    {
      signal,
      accessToken,
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
  const accessToken = await getAccessToken();
  const { callApi } = await loadApi();
  const plans = await callApi((client) => client.subscriptions.plans(), {
    signal,
    accessToken,
    ErrorClass: SubscriptionRepositoryError,
    failed: {
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.FETCH_SUBSCRIPTION_PLANS_FAILED,
      message: 'Impossible de recuperer les plans abonnement.',
    },
    invalid: {
      code: SUBSCRIPTION_REPOSITORY_ERROR_CODE.INVALID_SUBSCRIPTION_PLANS_PAYLOAD,
      message: 'Le format des plans abonnement recus est invalide.',
    },
  });

  return plans.map(toPlanDomain);
};

export const createSubscription = async (
  planCode: SubscriptionPlanCode,
): Promise<SubscriptionRecord> => {
  const accessToken = await getAccessToken();
  const { callApi } = await loadApi();
  const subscription = await callApi(
    (client) => client.subscriptions.create({ payload: { planCode } }),
    {
      accessToken,
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
      request: { group: 'subscriptions', endpoint: 'create', part: 'Payload' },
    },
  );

  return toDomain(subscription);
};
