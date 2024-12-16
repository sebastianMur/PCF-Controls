import * as React from 'react';
import type { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import CustomComponent from './src/components/document-manager';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  return (
    <Provider store={store}>
      <CustomComponent context={context} />
    </Provider>
  );
};
