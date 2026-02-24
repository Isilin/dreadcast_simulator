import { Outlet, createRootRoute } from '@tanstack/react-router';

import { ThemeProvider } from '@/feature/theme';
import { ThemeToggle } from '@/ui';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <ThemeToggle />
      <Outlet />
    </ThemeProvider>
  ),
});
