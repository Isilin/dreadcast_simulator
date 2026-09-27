import { Schema } from 'effect';

/** Same pattern as zod's z.email(), used by the legacy endpoint. */
const EMAIL_PATTERN =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export const LoginPayload = Schema.Struct({
  email: Schema.String.check(Schema.isPattern(EMAIL_PATTERN)),
  password: Schema.String.check(Schema.isMinLength(1)),
});

export const LoginResponse = Schema.Struct({
  accessToken: Schema.String,
  refreshToken: Schema.String,
});
