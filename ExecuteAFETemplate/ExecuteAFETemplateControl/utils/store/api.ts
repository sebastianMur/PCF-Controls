import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { selectBaseUrl } from ".";
import type { RootState } from ".";

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: [],
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
