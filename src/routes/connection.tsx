import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginForm, requireAuthenticatedSession } from '@/feature/auth';
import Routes from '@/utils/routes';

export const Route = createFileRoute(Routes.connection)({
  beforeLoad: async () => {
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
