import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IInputs } from '../../../generated/ManifestTypes';
import type { IPage } from '../../types/page';

interface IPCFContext {
  context: ComponentFramework.Context<IInputs> | undefined;
  baseUrl: string;
  entityId: string;
  entityTypeName: string;
}

const initialState: IPCFContext = {
  context: undefined,
  baseUrl: '',
  entityId: '',
  entityTypeName: '',
};

const pcfContextSlice = createSlice({
  name: 'pcfContext',
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<ComponentFramework.Context<IInputs>>) => {
      const { payload } = action;
      const { page } = payload as unknown as { page: IPage };
      state.context = payload;
      console.log('🚀 ~ context :', payload);
      try {
        state.baseUrl = (page as IPage).getClientUrl();
        state.entityId = (page as IPage).entityId;
        state.entityTypeName = (page as IPage).entityTypeName;
      } catch (error) {
        console.error('Error getting base URL', error);
      }
    },
  },
});

export const { setContext } = pcfContextSlice.actions;

export default pcfContextSlice.reducer;
