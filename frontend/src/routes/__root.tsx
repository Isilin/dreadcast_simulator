import { ThemeProvider } from '@/feature/theme';
import { ThemeToggle } from '@/ui';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <ThemeToggle />
      <Outlet />
    </ThemeProvider>
  ),
});
