import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import styles from './AuthAccessButton.module.css';

import { useAuthState } from '@/feature/auth/model';
import { signOut } from '@/feature/auth/services';

export const AuthAccessButton = () => {
  const navigate = useNavigate();
  const isConnexionPage = useRouterState({
    select: (state) => state.location.pathname === '/connexion',
  });
  const { session } = useAuthState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      await navigate({ to: isConnexionPage ? '/' : '/connexion' });
      return;
    }

    setIsSubmitting(true);
    await signOut();
    setIsSubmitting(false);
    setIsMenuOpen(false);
  };

  const handleOpenSubscription = async () => {
    setIsMenuOpen(false);
    await navigate({ to: '/abonnement' });
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.menuRoot}>
        <button
          type="button"
          className={styles.button}
          onClick={() => void handleClick()}
          disabled={isSubmitting}
        >
          {isConnexionPage ? 'Retour' : 'Connexion'}
        </button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className={styles.menuRoot}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsMenuOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      >
        Compte
      </button>

      {isMenuOpen ? (
        <div className={styles.menu} role="menu" aria-label="Menu utilisateur">
          <button
            type="button"
            className={styles.menuItem}
            role="menuitem"
            onClick={() => void handleOpenSubscription()}
          >
            Abonnement
          </button>
          <button
            type="button"
            className={styles.menuItem}
            role="menuitem"
            onClick={() => void handleClick()}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Déconnexion...' : 'Déconnexion'}
          </button>
        </div>
      ) : null}
    </div>
  );
};
