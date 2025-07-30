import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";

export const contextSlice = createSlice({
  name: "context",
  initialState: {
    baseUrl: "",
    WPNId: "",
    templateId: "",
    templateMode: "completion",
  },
  reducers: {
    setWPNId: (state, { payload }: PayloadAction<string>) => {
      state.WPNId = payload;
    },
    setTemplateId: (state, { payload }: PayloadAction<string>) => {
      state.templateId = payload;
    },
    setBaseUrl: (state, { payload }: PayloadAction<string>) => {
      state.baseUrl = payload;
    },
    setTemplateMode: (state, { payload }: PayloadAction<string>) => {
      state.templateMode = payload;
    },
  },
});

export const selectWPNId = (state: RootState) => state.context.WPNId;
export const selectTemplateId = (state: RootState) => state.context.templateId;
export const selectBaseUrl = (state: RootState) => state.context.baseUrl;
export const selectTemplateMode = (state: RootState) =>
  state.context.templateMode;

export const { setWPNId, setTemplateId, setBaseUrl, setTemplateMode } =
  contextSlice.actions;
