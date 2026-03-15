import { Outlet, createRootRoute } from '@tanstack/react-router';

import { AuthAccessButton, AuthBootstrap } from '@/feature/auth';
import { ThemeProvider } from '@/feature/theme';
import { ThemeToggle } from '@/ui';

export const Route = createRootRoute({
  component: () => (
    <AuthBootstrap>
      <ThemeProvider>
        <AuthAccessButton />
        <ThemeToggle />
        <Outlet />
      </ThemeProvider>
    </AuthBootstrap>
  ),
});
