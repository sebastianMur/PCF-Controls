import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api";
import { contextSlice } from "./context-slice";

export const createStore = () =>
  configureStore({
    reducer: {
      context: contextSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export * from "./context-slice";
