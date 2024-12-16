import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import type { IInputs } from './generated/ManifestTypes';
import QuestionnaireDesigner from './components/questionnaire-designer';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  console.log('🚀 ~ context:', context);
  return (
    <Provider store={store}>
      <QuestionnaireDesigner context={context} />
    </Provider>
  );
};
