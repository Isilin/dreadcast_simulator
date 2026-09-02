import { Link } from '@tanstack/react-router';
import type { PropsWithChildren, ReactNode } from 'react';

import styles from './AppShell.module.css';

interface AppShellProps extends PropsWithChildren {
  actions: ReactNode;
}

export const AppShell = ({ actions, children }: AppShellProps) => {
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
        <div className={styles.status} aria-label="Espace de simulation">
          Simulateur
        </div>
        <div className={styles.actions}>{actions}</div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
