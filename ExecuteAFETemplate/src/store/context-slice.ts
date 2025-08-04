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
  },
  reducers: {
    setTemplateSummaryId: (state, { payload }: PayloadAction<string>) => {
      state.templateSummaryId = isValidD365Guid(payload) ? payload : "";
    },
    setTemplateId: (state, { payload }: PayloadAction<string>) => {
      state.templateId = isValidD365Guid(payload) ? payload : "";
    },
    setBaseUrl: (state, { payload }: PayloadAction<string>) => {
      state.baseUrl = payload;
    },
  },
});

export const selectTemplateSummaryId = (state: RootState) =>
  state.context.templateSummaryId;
export const selectTemplateId = (state: RootState) => state.context.templateId;
export const selectBaseUrl = (state: RootState) => state.context.baseUrl;

export const { setTemplateSummaryId, setTemplateId, setBaseUrl } =
  contextSlice.actions;
