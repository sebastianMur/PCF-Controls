/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { Post } from '../../types/post';

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
      ? { url: `${baseUrl}${args}` } // If `args` is a string, prepend the base URL
      : { ...args, url: `${baseUrl}${args.url}` }; // If `args` is an object, adjust the `url` field

  console.log('🚀 ~ constdynamicBaseQuery ~ adjustedArgs:', adjustedArgs);
  // Use `fetchBaseQuery` with the adjusted arguments
  const baseQuery = fetchBaseQuery({ baseUrl });
  return baseQuery(adjustedArgs, api, extraOptions);
};

export const notes = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: builder => ({
    getNotes: builder.query<Post[], void>({
      query: () => '/api/data/v9.2/annotations?$select=annotationid,documentbody,filename,filesize',
    }),
    getNotesWithId: builder.query<Post[], { id: string }>({
      query: ({ id }) => `/api/data/v9.2/annotations(${id})?$select=annotationid,documentbody,filename,filesize`,
    }),

    deleteBooking: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api/data/v9.2/annotations(${id})`,
        method: 'DELETE',
      }),
    }),

    createBooking: builder.mutation<Post, Omit<Post, 'id'>>({
      query: post => ({
        url: '/api/data/v9.2/annotations',
        method: 'POST',
        body: post,
      }),
    }),

    updatebooking: builder.mutation<Post, Post>({
      query: post => ({
        url: `/api/data/v9.2/annotations(${post.id})`,
        method: 'PATCH',
        body: post,
      }),
    }),
  }),
});

export const { useGetNotesQuery, useGetNotesWithIdQuery } = notes;
