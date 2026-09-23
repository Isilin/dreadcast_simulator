import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import styles from './AccessGate.module.css';

import Routes from '@/utils/routes';

interface AccessGateProps {
  title: string;
  children: ReactNode;
}

/**
 * Invites a signed-in user to subscribe to unlock a Communauté feature.
 */
export const SubscriberGate = ({ title, children }: AccessGateProps) => (
  <section className={styles.gate}>
    <p className={styles.overline}>Réservé aux abonnés</p>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.text}>{children}</div>
    <Link to={Routes.subscription} className={styles.cta}>
      Voir les abonnements
    </Link>
  </section>
);

/**
 * Invites a guest to sign in before browsing the Communauté.
 */
export const GuestGate = ({ title, children }: AccessGateProps) => (
  <section className={styles.gate}>
    <p className={styles.overline}>Connexion requise</p>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.text}>{children}</div>
    <Link to={Routes.connection} className={styles.cta}>
      Se connecter
    </Link>
  </section>
);
