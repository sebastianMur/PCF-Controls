import { fromApiAttachments } from "@/mappers/attachment-mapper";
import { baseApi } from "@/store/base-api";
import type {
  Attachment,
  D365Attachment,
  SendAttachment,
} from "@/types/template";

interface DeleteAttachmentResponse {
  success: boolean;
}

export const notesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createNote: builder.mutation<void, SendAttachment>({
      query: attachment => ({
        url: "annotations",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attachment),
      }),
      invalidatesTags: ["attachments"],
    }),
    updateNote: builder.mutation<void, SendAttachment>({
      query: attachment => ({
        url: "annotations",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attachment),
      }),
      invalidatesTags: ["attachments"],
    }),

    deleteAttachment: builder.mutation<DeleteAttachmentResponse, string>({
      query: attachmentId => ({
        url: `/annotations(${attachmentId})`,
        method: "DELETE",
      }),
      invalidatesTags: ["attachments"],
    }),

    getNotes: builder.query<Attachment[], string>({
      query: templateSummaryId =>
        `annotations?$select=annotationid,notetext,documentbody,filename,filesize,isdocument,mimetype,_objectid_value,subject&$filter=(isdocument eq true and _objectid_value eq ${templateSummaryId})`,
      transformResponse: (response: {
        value: D365Attachment[];
      }): Attachment[] => {
        return response.value.map(fromApiAttachments);
      },
      providesTags: ["attachments"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteAttachmentMutation,
} = notesApi;
