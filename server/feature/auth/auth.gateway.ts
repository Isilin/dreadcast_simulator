export interface SessionTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/**
 * Password sign-in, behind an interface so routes can be tested without it.
 * Throws an HttpError: 401 when refused, 500 when the call fails.
 */
export interface AuthGateway {
  readonly signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<SessionTokens>;
}
