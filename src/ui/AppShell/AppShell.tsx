import { Link, type LinkProps } from '@tanstack/react-router';
import type { PropsWithChildren, ReactNode } from 'react';

import styles from './AppShell.module.css';

export interface AppShellNavLink {
  to: NonNullable<LinkProps['to']>;
  label: string;
  /** Only active on the exact path (e.g. "/"). */
  exact?: boolean;
}

interface AppShellProps extends PropsWithChildren {
  actions: ReactNode;
  nav?: AppShellNavLink[];
}

export const AppShell = ({ actions, nav, children }: AppShellProps) => {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand} aria-label="Dreadcast Simulator">
          <span className={styles.brandMark}>DS</span>
          <span className={styles.brandText}>
            <strong>Dreadcast</strong>
            <span>Atelier de build</span>
          </span>
        </Link>
        {nav && nav.length > 0 ? (
          <nav className={styles.nav} aria-label="Navigation principale">
            {nav.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={styles.navLink}
                activeProps={{ className: styles.navLinkActive }}
                activeOptions={{ exact: link.exact ?? false }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <div className={styles.status} aria-label="Espace de simulation">
            Simulateur
          </div>
        )}
        <div className={styles.actions}>{actions}</div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
