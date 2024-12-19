import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { INote, IPostNote } from '../../types/note';
import type { IDocument } from '../../types/document-manager';
import { base64ToBlob } from '../../utils/functions';

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
    getNotes: builder.query<IDocument[], string>({
      query: entityTypeName =>
        `/api/data/v9.2/annotations?$select=annotationid,notetext,filename,filesize,isdocument,documentbody,mimetype,_objectid_value,subject&$filter=(isdocument eq true and objecttypecode eq '${entityTypeName}')`,
      transformResponse: (response: { value: INote[] }) => {
        console.log('🚀 ~ response:', response);

        return response.value.map(note => ({
          annotationid: note.annotationid,
          name: note.filename,
          type: note.mimetype,
          url: URL.createObjectURL(base64ToBlob(note.documentbody, note.mimetype)),
        }));
      },
    }),

    createNote: builder.mutation<IPostNote, Omit<IPostNote, 'annotationId'>>({
      query: post => ({
        url: '/api/data/v9.2/annotations',
        method: 'POST',
        body: post,
      }),
    }),

    updateNote: builder.mutation<IPostNote, { patchNote: IPostNote; id: string }>({
      query: ({ patchNote, id }: { patchNote: Omit<IPostNote, 'annotationId'>; id: string }) => ({
        url: `/api/data/v9.2/annotations(${id})`,
        method: 'PATCH',
        body: patchNote,
      }),
    }),

    deleteNote: builder.mutation<string, string>({
      query: annotationId => ({
        url: `/api/data/v9.2/annotations(${annotationId})`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetNotesQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } = notes;
