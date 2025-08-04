import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from ".";
import { selectBaseUrl } from "./context-slice";

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "template",
    "templateSummary",
    "gfcm",
    "gfcmSummary",
    "lineItems",
    "lineItemsDetail",
    "attachments",
  ],
  baseQuery: ((args, store, extraOptions) =>
    fetchBaseQuery({
      baseUrl: `${selectBaseUrl(store.getState() as RootState)}/api/data/v9.2`,
    })(args, store, extraOptions)) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  >,
  endpoints: () => ({}), // 👈 leave empty
});
