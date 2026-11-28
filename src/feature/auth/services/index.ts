export { AuthBootstrap } from './AuthBootstrap';

const loadAuthService = () => import('./auth.service');

/**
 * Before a signed-in /api call: throws when there is no session (the session
 * itself travels in its cookie). Callers provide their own typed error.
 */
export const requireSession = async (
  createMissingSessionError: () => Error = () =>
    new Error('Session utilisateur manquante.'),
): Promise<void> => {
  const { getCurrentSession } = await loadAuthService();
  if (!(await getCurrentSession())) {
    throw createMissingSessionError();
  }
};
