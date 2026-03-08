import type { ZodSchema } from 'zod';

import { RepositoryError } from './repository-error';

interface ValidatePayloadOptions<T> {
  schema: ZodSchema<T>;
  payload: unknown;
  errorCode: string;
  errorMessage: string;
}

export const validatePayload = <T>({
  schema,
  payload,
  errorCode,
  errorMessage,
}: ValidatePayloadOptions<T>): T => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new RepositoryError({
      code: errorCode,
      message: errorMessage,
      cause: parsed.error,
    });
  }

  return parsed.data;
};
