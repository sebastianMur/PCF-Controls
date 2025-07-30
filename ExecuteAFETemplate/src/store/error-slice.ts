import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";


export type State = {
  apiError: FetchBaseQueryError;
};

const initialState: State = {
  apiError: {} as FetchBaseQueryError,
};

export const mediumSlice = createSlice({
  name: "medium",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      isAnyOf(
        // questionnaireApi.endpoints.getAllQuestionnaires.matchRejected,
        // questionnaireApi.endpoints.saveQuestionnaireQuestions.matchRejected,
        // questionnaireApi.endpoints.postQuestionnaire.matchRejected,
        // questionnaireApi.endpoints.patchQuestionnaire.matchRejected,
        // questionnairePageApi.endpoints.getPagesByQuestionnaire.matchRejected,
        // questionApi.endpoints.getQuestionsByQuestionnaire.matchRejected,

        // phhApi.endpoints.getPhhsByContact.matchRejected,
        // phhApi.endpoints.patchPhh.matchRejected,
        // phhApi.endpoints.postPhh.matchRejected,

        // contactApi.endpoints.getContact.matchRejected,
        // contactApi.endpoints.patchContact.matchRejected,
        // metadataApi.endpoints.getEntities.matchRejected,
        // metadataApi.endpoints.getGlobalOptionset.matchRejected,
        // responseAnswerApi.endpoints.getResponseAnswers.matchRejected,
        // responseAnswerApi.endpoints.patchResponseAnswer.matchRejected,
        // responseApi.endpoints.getEntityRecords.matchRejected,
        // responseApi.endpoints.getQuestionnaireResponses.matchRejected,
        // responseApi.endpoints.postQuestionnaireResponse.matchRejected,
        // responseAnswerApi.endpoints.saveAnswers.matchRejected,
      ),
      (state, { payload }) => {
        state.apiError = payload as FetchBaseQueryError;
      },
    );
  },
});

export const selectApiError = (state: { medium: State }) =>
  state.medium.apiError;

export default mediumSlice.reducer;
