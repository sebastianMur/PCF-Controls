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
          attachmentId: `ATT${Date.now()}`,
          templateSummaryId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          fileUrl: `https://mock-storage.com/${file.name}`,
        };

        // Add to mock storage
        mockAttachments.push(attachment);

        return { data: attachment };
      },
      invalidatesTags: ["Attachment", "TemplateCompletion"],
    }),

    deleteAttachment: builder.mutation<DeleteAttachmentResponse, string>({
      queryFn: async attachmentId => {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Remove from mock storage
        mockAttachments = mockAttachments.filter(
          att => att.attachmentId !== attachmentId,
        );

        return { data: { success: true } };
      },
      invalidatesTags: ["Attachment", "TemplateCompletion"],
    }),

    getAttachments: builder.query<Attachment[], string>({
      queryFn: async templateSummaryId => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const filteredAttachments = mockAttachments.filter(
          att => att.templateSummaryId === templateSummaryId,
        );
        return { data: filteredAttachments };
      },
      providesTags: ["Attachment"],
    }),
  }),
});

export const {
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetAttachmentsQuery,
} = notesApi;
