import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { CustomComponent } from '../../DocumentManager/DocumentManagerControl/src/components/CustomComponent';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  console.log('🚀 ~ context:', context);
  return (
    <Provider store={store}>
      <CustomComponent context={context} />
    </Provider>
  );
};
