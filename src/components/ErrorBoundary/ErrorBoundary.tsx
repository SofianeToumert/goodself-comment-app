import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from 'react-error-boundary';
import type { ReactNode } from 'react';
import { logger } from '../../services/logger';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unknown error occurred';

  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>
          We encountered an unexpected error. Please try again.
        </p>
        <details className={styles.details}>
          <summary className={styles.summary}>Error details</summary>
          <pre className={styles.errorText}>{errorMessage}</pre>
        </details>
        <button
          type="button"
          className={styles.retryButton}
          onClick={resetErrorBoundary}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const logError = (
  error: unknown,
  info: { componentStack?: string | null }
) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  logger.error('React error boundary caught error', errorObj, {
    componentStack: info.componentStack ?? undefined,
  });
};

export const ErrorBoundary = ({ children, fallback }: Props) => (
  <ReactErrorBoundary
    FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
    onError={logError}
  >
    {children}
  </ReactErrorBoundary>
);
