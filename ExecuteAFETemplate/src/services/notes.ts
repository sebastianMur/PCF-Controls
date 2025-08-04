import { baseApi } from "@/store/base-api";
import type { Attachment } from "@/types/template";

let mockAttachments: Attachment[] = [];

interface DeleteAttachmentResponse {
  success: boolean;
}

export const notesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadAttachment: builder.mutation<
      Attachment,
      { file: File; templateSummaryId: string }
    >({
      queryFn: async ({ file, templateSummaryId }) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const attachment: Attachment = {
          annotationid: `ATT${Date.now()}`,
          objectid: templateSummaryId,
          filename: file.name,
          filesize: file.size,
          mimetype: file.type,
          createdon: new Date().toISOString(),
        };

        // Add to mock storage
        mockAttachments.push(attachment);

        return { data: attachment };
      },
      invalidatesTags: ["attachments"],
    }),

    deleteAttachment: builder.mutation<DeleteAttachmentResponse, string>({
      queryFn: async attachmentId => {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from mock storage
        mockAttachments = mockAttachments.filter(
          att => att.annotationid !== attachmentId,
        );

        return { data: { success: true } };
      },
      invalidatesTags: ["attachments"],
    }),

    getAttachments: builder.query<Attachment[], string>({
      queryFn: async templateSummaryId => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const filteredAttachments = mockAttachments.filter(
          att => att.objectid === templateSummaryId,
        );
        return { data: filteredAttachments };
      },
      providesTags: ["attachments"],
    }),
  }),
});

export const {
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetAttachmentsQuery,
} = notesApi;
