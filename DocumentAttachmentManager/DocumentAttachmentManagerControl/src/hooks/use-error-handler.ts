import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string;
  details?: unknown;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  const handleError = useCallback((error: unknown, context: string) => {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    setError({ hasError: true, message: `${context}: ${message}`, details: error });
    // Optionally log to your telemetry service
    console.error(`[${context}]`, error);
  }, []);

  const clearError = useCallback(() => {
    setError({ hasError: false, message: '' });
  }, []);

  return { error, handleError, clearError };
};
