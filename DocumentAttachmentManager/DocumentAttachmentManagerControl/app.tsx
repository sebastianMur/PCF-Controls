import * as React from 'react';
import type { IInputs } from './generated/ManifestTypes';
import DocumentManager from './src/components/document-manager';
import ErrorBoundary from './src/components/error-boundary';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { usePCFStore } from './src/store/context-store';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

const queryClient = new QueryClient();

export const App = ({ context }: IAppProps) => {
  const { setContext } = usePCFStore();
  useEffect(() => {
    setContext(context);
  }, [context, setContext]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={
          <div className='error-container'>
            <h2>Something went wrong</h2>
            <p>The Document Manager encountered an error. Please try refreshing the page.</p>
          </div>
        }
      >
        <DocumentManager />
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
