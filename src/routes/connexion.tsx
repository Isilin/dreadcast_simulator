import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginForm, requireAuthenticatedSession } from '@/feature/auth';

export const Route = createFileRoute('/connexion')({
  beforeLoad: async () => {
    const isAuthenticated = await requireAuthenticatedSession();

    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: ConnexionPage,
});

function ConnexionPage() {
  return <LoginForm />;
}
