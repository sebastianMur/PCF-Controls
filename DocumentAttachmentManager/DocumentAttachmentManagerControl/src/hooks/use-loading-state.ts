import { useState, useCallback } from 'react';

export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const isLoading = useCallback((key: string) => loadingStates[key], [loadingStates]);

  const isAnyLoading = useCallback(() => Object.values(loadingStates).some(state => state), [loadingStates]);

  return { setLoading, isLoading, isAnyLoading };
};
