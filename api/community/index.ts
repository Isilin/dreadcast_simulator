import type { VercelRequest, VercelResponse } from '@vercel/node';

import { routeCommunityRequest } from '../../lib/community.handlers.js';
import { getOptionalStringParam, handleError } from '../../lib/helper.api.js';

/**
 * Single function for the whole Community feature (Vercel Hobby function
 * limit). vercel.json rewrites /api/community/* here with resource/id/action
 * query params.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await routeCommunityRequest(req, res, {
      resource: getOptionalStringParam(req.query.resource),
      id: getOptionalStringParam(req.query.id),
      action: getOptionalStringParam(req.query.action),
    });
  } catch (error) {
    return handleError(res, error, 'Erreur Communaute');
  }
}
