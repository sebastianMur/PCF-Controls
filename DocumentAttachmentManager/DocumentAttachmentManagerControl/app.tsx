import * as React from 'react';
import type { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import DocumentManager from './src/components/document-manager';
import ErrorBoundary from './src/components/error-boundary';
import { useEffect } from 'react';
import { setContext } from './src/store/app/context-slice';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  useEffect(() => {
    // Initialize context in Redux store
    store.dispatch(setContext(context));
  }, [context]);

  return (
    <Provider store={store}>
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
    </Provider>
  );
};
