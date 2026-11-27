import { z } from '@hono/zod-openapi';

/** Same pattern as the legacy endpoint (zod z.email()). */
const EMAIL_PATTERN =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export const LoginPayload = z.object({
  email: z.string().regex(EMAIL_PATTERN),
  password: z.string().min(1),
});

export const LoginResponse = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .openapi('LoginResponse');
