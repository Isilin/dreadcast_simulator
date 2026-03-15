import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';

import styles from './LoginForm.module.css';

import {
  getMissingAuthConfigErrorMessage,
  isAuthConfigured,
  signInWithPassword,
} from '@/feature/auth/services';

export const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authConfigured = isAuthConfigured();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailValue = email.trim();
    if (!emailValue || !password) {
      setErrorMessage('Veuillez renseigner un identifiant et un mot de passe.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await signInWithPassword({
      email: emailValue,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await navigate({ to: '/' });
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="connexion-title">
        <h1 id="connexion-title" className={styles.title}>
          Connexion
        </h1>
        <p className={styles.subtitle}>
          Connectez-vous avec votre utilisateur et votre mot de passe pour
          accéder au simulateur.
        </p>

        {!authConfigured ? (
          <p className={styles.error}>{getMissingAuthConfigErrorMessage()}</p>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="auth-user">
            Utilisateur (email)
          </label>
          <input
            className={styles.input}
            id="auth-user"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="exemple@dreadcast.net"
            required
            disabled={!authConfigured || isSubmitting}
          />

          <label className={styles.label} htmlFor="auth-password">
            Mot de passe
          </label>
          <input
            className={styles.input}
            id="auth-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            disabled={!authConfigured || isSubmitting}
          />

          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

          <button
            className={styles.submit}
            type="submit"
            disabled={!authConfigured || isSubmitting}
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </section>
    </main>
  );
};
