import type { VercelRequest, VercelResponse } from '@vercel/node';

import { routeCommunityRequest } from '../../lib/community.handlers.js';
import { getOptionalStringParam, handleError } from '../../lib/helper.api.js';
import { handleProfile } from '../../lib/profile.handlers.js';

/**
 * Single function for the whole Community feature (Vercel Hobby function
 * limit). vercel.json rewrites /api/community/* and /api/profile/me here with
 * resource/id/action query params.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const resource = getOptionalStringParam(req.query.resource);

    if (resource === 'profile') {
      return await handleProfile(req, res);
    }

    return await routeCommunityRequest(req, res, {
      resource,
      id: getOptionalStringParam(req.query.id),
      action: getOptionalStringParam(req.query.action),
    });
  } catch (error) {
    return handleError(res, error, 'Erreur Communaute');
  }
}
