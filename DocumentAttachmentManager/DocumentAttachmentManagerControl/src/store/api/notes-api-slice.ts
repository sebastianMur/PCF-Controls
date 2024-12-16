import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { INote } from '../../types/note';

// const baseUrl = Xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.2';

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // Get the base URL from the Redux state
  const baseUrl = (api.getState() as RootState).pcfApi.baseUrl;

  console.log('🚀 ~ dynamicBaseQuery ~ baseUrl:', api.getState());

  if (!baseUrl) {
    // Return an error if the base URL is not set
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'Base URL is not set in the state.',
      },
    };
  }

  // Adjust the args to include the base URL
  const adjustedArgs =
    typeof args === 'string'
      ? { url: baseUrl + args } // If  is a string, prepend the base URL
      : { ...args, url: baseUrl + args.url }; // If  is an object, adjust the  field

  console.log('🚀 ~ constdynamicBaseQuery ~ adjustedArgs:', adjustedArgs);
  // Use  with the adjusted arguments
  const baseQuery = fetchBaseQuery({ baseUrl });
  return baseQuery(adjustedArgs, api, extraOptions);
};

export const notes = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: builder => ({
    getNotes: builder.query<INote[], void>({
      query: () => '/api/data/v9.2/annotations?=annotationid,documentbody,filename,filesize',
    }),

    createBooking: builder.mutation<INote, Omit<INote, 'annotationId'>>({
      query: post => ({
        url: '/api/data/v9.2/annotations',
        method: 'POST',
        body: post,
      }),
    }),
  }),
});

export const { useGetNotesQuery } = notes;

