import { z } from '@hono/zod-openapi';

import { isPseudoValid } from './profile.rules.js';

export const Profile = z
  .object({
    /** null until the user picks one (definitive). */
    pseudo: z.string().nullable(),
  })
  .openapi('Profile');

export const PseudoPayload = z.object({
  pseudo: z.string().trim().refine(isPseudoValid),
});
