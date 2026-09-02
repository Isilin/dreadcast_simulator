import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginForm } from '@/feature/auth';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.connection)({
  beforeLoad: async () => {
    const { requireAuthenticatedSession } =
      await import('@/feature/auth/services/auth.service');
    const isAuthenticated = await requireAuthenticatedSession();

    if (isAuthenticated) {
      throw redirect({ to: Routes.home });
    }
  },
  component: ConnectionPage,
});

function ConnectionPage() {
  return <LoginForm />;
}
