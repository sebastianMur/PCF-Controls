import * as React from 'react';
import type { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import DocumentManager from './src/components/document-manager';
import AppContent from './src/components/document-manager';
import ErrorBoundary from './src/components/error-boundary';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  console.log('🚀 ~ App :');

  return (
    <Provider store={store}>
      <ErrorBoundary fallback={<div>Failed to load Document Manager</div>}>
        <AppContent context={context} />
      </ErrorBoundary>
    </Provider>
  );
};
