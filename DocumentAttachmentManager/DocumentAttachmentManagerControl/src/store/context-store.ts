import { create } from 'zustand';
import type { IInputs } from '../../generated/ManifestTypes';
import type { IPage } from '../types/page';

interface PCFState {
  context: ComponentFramework.Context<IInputs> | undefined;
  baseUrl: string;
  entityId: string;
  entityTypeName: string;
  setContext: (context: ComponentFramework.Context<IInputs>) => void;
}

export const usePCFStore = create<PCFState>(set => ({
  context: undefined,
  baseUrl: '',
  entityId: '',
  entityTypeName: '',
  setContext: context => {
    const { page } = context as unknown as { page: IPage };
    set({
      context,
      baseUrl: (page as IPage).getClientUrl(),
      entityId: (page as IPage).entityId,
      entityTypeName: (page as IPage).entityTypeName,
    });
  },
}));
