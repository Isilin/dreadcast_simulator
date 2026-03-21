import { Outlet, createRootRoute } from '@tanstack/react-router';

import { AuthAccessButton, AuthBootstrap } from '@/feature/auth';
import { BuildReadOnlyProvider } from '@/feature/persistence';
import { ThemeProvider } from '@/feature/theme';
import { ThemeToggle } from '@/ui';

export const Route = createRootRoute({
  component: () => (
    <AuthBootstrap>
      <ThemeProvider>
        <BuildReadOnlyProvider value={false}>
          <ThemeToggle />
          <AuthAccessButton />
          <Outlet />
        </BuildReadOnlyProvider>
      </ThemeProvider>
    </AuthBootstrap>
  ),
});
