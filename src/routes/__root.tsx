import { Outlet, createRootRoute } from '@tanstack/react-router';

import { AccountMenuItem, PseudoDialog } from '@/feature/account';
import { AuthAccessButton, AuthBootstrap } from '@/feature/auth';
import { BuildReadOnlyProvider } from '@/feature/persistence';
import { ThemeProvider } from '@/feature/theme';
import { AppShell, ThemeToggle, type AppShellNavLink } from '@/ui';
import Routes from '@/utils/routes';

const NAV_LINKS: AppShellNavLink[] = [
  { to: Routes.home, label: 'Atelier', exact: true },
  { to: Routes.community, label: 'Communauté' },
];

export const Route = createRootRoute({
  component: () => (
    <AuthBootstrap>
      <ThemeProvider>
        <BuildReadOnlyProvider value={false}>
          <AppShell
            nav={NAV_LINKS}
            actions={
              <>
                <ThemeToggle />
                <AuthAccessButton
                  renderExtraMenuItems={(closeMenu) => (
                    <AccountMenuItem onSelect={closeMenu} />
                  )}
                />
              </>
            }
          >
            <Outlet />
          </AppShell>
          <PseudoDialog />
        </BuildReadOnlyProvider>
      </ThemeProvider>
    </AuthBootstrap>
  ),
});
