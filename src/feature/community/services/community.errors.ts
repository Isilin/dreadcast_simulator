import { createRepositoryErrorClass } from '@/utils/repository-error';

export const COMMUNITY_REPOSITORY_ERROR_CODE = {
  MISSING_AUTH_SESSION: 'MISSING_AUTH_SESSION',
  REQUEST_FAILED: 'COMMUNITY_REQUEST_FAILED',
  INVALID_PAYLOAD: 'INVALID_COMMUNITY_PAYLOAD',
} as const;

/**
 * API codes the UI reacts to (see lib/community.api.ts).
 */
export const COMMUNITY_API_ERROR_CODE = {
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  PSEUDO_REQUIRED: 'PSEUDO_REQUIRED',
  FROZEN: 'FROZEN',
  ALREADY_PUBLISHED: 'ALREADY_PUBLISHED',
  PUBLICATION_NOT_FOUND: 'PUBLICATION_NOT_FOUND',
} as const;

export const CommunityRepositoryError = createRepositoryErrorClass(
  'CommunityRepositoryError',
);
