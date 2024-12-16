import { configureStore } from '@reduxjs/toolkit';
import pcfContextReducer from './app-states/pcf-context-slice';
import { notes } from './api-states/notes-api-slice';
export const store = configureStore({
  reducer: {
    pcfApi: pcfContextReducer,
    [notes.reducerPath]: notes.reducer,
  },

  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(notes.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
