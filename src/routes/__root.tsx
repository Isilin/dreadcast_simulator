import { Outlet, createRootRoute } from '@tanstack/react-router';

import { AuthAccessButton, AuthBootstrap } from '@/feature/auth';
import { BuildReadOnlyProvider } from '@/feature/persistence';
import { ThemeProvider } from '@/feature/theme';
import { AppShell, ThemeToggle } from '@/ui';

export const Route = createRootRoute({
  component: () => (
    <AuthBootstrap>
      <ThemeProvider>
        <BuildReadOnlyProvider value={false}>
          <AppShell
            actions={
              <>
                <ThemeToggle />
                <AuthAccessButton />
              </>
            }
          >
            <Outlet />
          </AppShell>
        </BuildReadOnlyProvider>
      </ThemeProvider>
    </AuthBootstrap>
  ),
});
