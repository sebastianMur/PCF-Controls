import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IInputs } from '../../generated/ManifestTypes';
import type { IPage } from '../../types/page';

interface IPCFContext {
  context: ComponentFramework.Context<IInputs> | undefined;
  baseUrl: string;
}

const initialState: IPCFContext = {
  context: undefined,
  baseUrl: '',
};

const pcfContextSlice = createSlice({
  name: 'pcfContext',
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<ComponentFramework.Context<IInputs>>) => {
      const { payload } = action;
      const { page } = payload as unknown as { page: IPage };

      state.context = payload;
      state.baseUrl = (page as IPage).getClientUrl();
    },
  },
});

export const { setContext } = pcfContextSlice.actions;

export default pcfContextSlice.reducer;
