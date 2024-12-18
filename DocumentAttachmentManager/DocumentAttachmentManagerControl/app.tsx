import * as React from 'react';
import type { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import DocumentManager from './src/components/document-manager';
import AppContent from './src/components/document-manager';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  return (
    <Provider store={store}>
      <AppContent context={context} />
    </Provider>
  );
};
