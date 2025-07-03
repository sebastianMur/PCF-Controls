import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '.';

export const contextSlice = createSlice({
  name: 'context',
  initialState: { baseUrl: '', entityId: '', templateMode: 'completion' },
  reducers: {
    setEntityId: (state, { payload }: PayloadAction<string>) => {
      state.entityId = payload;
    },
    setBaseUrl: (state, { payload }: PayloadAction<string>) => {
      state.baseUrl = payload;
    },
    setTemplateMode: (state, { payload }: PayloadAction<string>) => {
      state.templateMode = payload;
    },
  },
});

export const selectEntityId = (state: RootState) => state.context.entityId;
export const selectBaseUrl = (state: RootState) => state.context.baseUrl;
export const selectTemplateMode = (state: RootState) => state.context.templateMode;

export const { setEntityId, setBaseUrl, setTemplateMode } = contextSlice.actions;
