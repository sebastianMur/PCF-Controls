import { isValidD365Guid } from "@/utils/functions";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";

export const contextSlice = createSlice({
  name: "context",
  initialState: {
    baseUrl: "",
    templateSummaryId: "",
    templateId: "",
    wpnId: "",
    paAlignment: false,
  },
  reducers: {
    setWPNId: (state, { payload }: PayloadAction<string>) => {
      state.wpnId = isValidD365Guid(payload) ? payload : "";
    },
    setTemplateSummaryId: (state, { payload }: PayloadAction<string>) => {
      state.templateSummaryId = isValidD365Guid(payload) ? payload : "";
    },
    setTemplateId: (state, { payload }: PayloadAction<string>) => {
      state.templateId = isValidD365Guid(payload) ? payload : "";
    },
    setBaseUrl: (state, { payload }: PayloadAction<string>) => {
      state.baseUrl = payload;
    },
    setPAAlignment: (state, { payload }: PayloadAction<boolean>) => {
      state.paAlignment = payload;
    },
    resetTemplateContext: state => {
      state.wpnId = "";
      state.templateSummaryId = "";
      state.paAlignment = false; 
      // optionally reset other related data slices if needed
    },
  },
});

export const selectTemplateSummaryId = (state: RootState) =>
  state.context.templateSummaryId;
export const selectWPNId = (state: RootState) => state.context.wpnId;
export const selectTemplateId = (state: RootState) => state.context.templateId;
export const selectBaseUrl = (state: RootState) => state.context.baseUrl;
export const selectPAAlignment = (state: RootState) => state.context.paAlignment;

export const {
  setTemplateSummaryId,
  setTemplateId,
  setBaseUrl,
  setWPNId,
  resetTemplateContext,
  setPAAlignment,
} = contextSlice.actions;
