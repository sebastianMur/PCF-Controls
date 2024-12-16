import * as React from 'react';
import { useDispatch } from 'react-redux';
import type { IInputs } from '../../generated/ManifestTypes';
import { setContext } from '../../store/app-states/pcf-context-slice';
import Overview from './overview-stage';
import type { AppDispatch, RootState } from '../../store';
import { useSelector } from 'react-redux/es/hooks/useSelector';

interface IQuestionnaireDesigner {
  context: ComponentFramework.Context<IInputs>;
}

const QuestionnaireDesigner = ({ context }: IQuestionnaireDesigner) => {
  const dispatch = useDispatch<AppDispatch>();
  const ctx = useSelector((state: RootState) => state.pcfApi.context);

  console.log('🚀 ~ QuestionnaireDesigner ~ context:', context);
  React.useEffect(() => {
    dispatch(setContext(context)); // Replace with your actual context data
  }, [dispatch, context]);

  if (!ctx) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Overview />
    </div>
  );
};

export default QuestionnaireDesigner;
