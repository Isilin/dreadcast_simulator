import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';

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

  const isAuthenticated = Boolean(session?.user);

  const handleClick = async () => {
    if (!isAuthenticated) {
      await navigate({ to: isConnexionPage ? '/' : '/connexion' });
      return;
    }

    setIsSubmitting(true);
    await signOut();
    setIsSubmitting(false);
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => void handleClick()}
      disabled={isSubmitting}
    >
      {isAuthenticated
        ? isSubmitting
          ? 'Déconnexion...'
          : 'Déconnexion'
        : isConnexionPage
          ? 'Retour'
          : 'Connexion'}
    </button>
  );
};
