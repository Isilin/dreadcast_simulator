import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: (error: Error) => React.ReactNode;
}

/**
 * Error Boundary component pour capturer et afficher les erreurs React
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging in development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Une erreur est survenue</h1>
            <p className={styles.message}>
              Désolé, une erreur inattendue s'est produite. Veuillez recharger
              la page.
            </p>
            <details className={styles.details}>
              <summary className={styles.summary}>Détails techniques</summary>
              <pre className={styles.error}>{this.state.error.message}</pre>
            </details>
            <button
              className={styles.button}
              onClick={() => window.location.reload()}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
