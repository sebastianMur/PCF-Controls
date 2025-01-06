import React, { useEffect } from 'react';
import type { IInputs } from '../../../generated/ManifestTypes';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { useSelector } from 'react-redux';
import { setContext } from '../../store/app/context-slice';
import DocumentManager from './document-manager';

interface IAppContentProps {
  context: ComponentFramework.Context<IInputs>;
}

export default function AppContent({ context }: IAppContentProps) {
  const ctx = useSelector((state: RootState) => state.pcfApi.context);
  const dispatch = useDispatch<AppDispatch>();

  console.log('🚀 ~ AppContent :');

  useEffect(() => {
    dispatch(setContext(context));
  }, [dispatch, context]);

  if (!ctx) {
    return <div>Loading...</div>;
  }

  return <DocumentManager />;
}
