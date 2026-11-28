/** Signed-in user, from the session cookie (GET /api/auth/me). */
export interface AuthSession {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthState {
  session: AuthSession | null;
  isBootstrapping: boolean;
}
