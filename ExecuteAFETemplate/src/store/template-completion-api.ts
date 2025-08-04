import type { TemplateFormData } from "@/forms/form-schemas";
import { fromApiGFCM } from "@/mappers/gfcm-mapper";
import { fromApiLineItem } from "@/mappers/line-item-mapper";
import { fromApiTemplate } from "@/mappers/template-mapper";
import type {
  D365GFCM,
  D365LineItem,
  D365Template,
  LineItemDetails,
  ODataEntityResponse,
  ODataMultipleResponse,
  TemplateCompletionData,
  TemplateSummary,
  Unit,
} from "../types/template";
import { baseApi } from "./base-api";
interface SaveTemplateCompletionResponse {
  success: boolean;
}

export const mockUnits: Unit[] = [
  { key: 529510000, value: "Per day" },
  { key: 529510001, value: "Per hour" },
  { key: 529510002, value: "Per foot" },
  { key: 529510003, value: "Each" },
];

export const templateCompletionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTemplateCompletionData: builder.query<
      TemplateCompletionData,
      { templateId: string; templateSummaryId?: string }
    >({
      async queryFn({ templateId }, _api, _extraOptions, fetchWithBQ) {
        try {
          // Required fetches based only on templateId
          const [templateRes, gfcmsRes, lineItemsRes] = await Promise.all([
            fetchWithBQ(
              `xomuog_templates?$select=xomuog_templateid,xomuog_name&$filter=xomuog_templateid eq ${templateId}`,
            ) as ODataEntityResponse<D365Template>,
            fetchWithBQ(
              `xomuog_gfcms?$select=xomuog_gfcmid,xomuog_gfcmcode,xomuog_name,_xomuog_templateid_value&$filter=_xomuog_templateid_value eq ${templateId}`,
            ) as ODataMultipleResponse<D365GFCM>,
            fetchWithBQ(
              `xomuog_lineitems?$select=xomuog_lineitemid,_xomuog_gfcmid_value,xomuog_name&$filter=xomuog_gfcmid/_xomuog_templateid_value eq ${templateId}`,
            ) as ODataMultipleResponse<D365LineItem>,
          ]);

          const requiredResponses = [templateRes, gfcmsRes, lineItemsRes];
          const firstError = requiredResponses.find(r => r.error)?.error;
          if (firstError) {
            return { error: firstError }; // ✅ only return if defined
          }

          const data: TemplateCompletionData = {
            template: fromApiTemplate(templateRes.data as D365Template),
            gfcms: gfcmsRes?.data?.value.map(fromApiGFCM) ?? [],
            lineItems: lineItemsRes?.data?.value?.map(fromApiLineItem) ?? [],
            units: mockUnits,
          };

          return { data };
        } catch (e) {
          return {
            error: {
              status: 500,
              data: { message: "Unexpected error fetching data." },
            },
          };
        }
      },
      providesTags: ["attachments"],
    }),

    updateTemplateSummary: builder.mutation<
      TemplateSummary,
      Partial<TemplateSummary> & { templateSummaryId: string }
    >({
      query: ({ templateSummaryId, ...updates }) => ({
        url: `new_templatesummaries(${templateSummaryId})`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: [],
    }),

    updateLineItemDetails: builder.mutation<
      LineItemDetails[],
      LineItemDetails[]
    >({
      async queryFn(details, _api, _extra, fetchWithBQ) {
        try {
          await Promise.all(
            details.map(d =>
              fetchWithBQ({
                url: `new_lineitemdetails(${d.xomuog_lineitemdetailid})`,
                method: "PATCH",
                body: d,
              }),
            ),
          );
          return { data: details };
        } catch (e) {
          return {
            error: {
              status: 500,
              data: { message: "Failed to update line item details" },
            },
          };
        }
      },
      invalidatesTags: [],
    }),

    saveTemplateCompletion: builder.mutation<
      SaveTemplateCompletionResponse,
      TemplateFormData
    >({
      queryFn: async (data, _api, _extra) => {
        try {
          console.log(
            "Saving template completion for:",
            data.templateSummary?.xomuog_templateid,
          );
          // Stub implementation
          return { data: { success: true } };
        } catch (e) {
          return {
            error: {
              status: 500,
              data: { message: "Save failed" },
            },
          };
        }
      },
      invalidatesTags: [],
    }),
  }),
});

export const {
  useGetTemplateCompletionDataQuery,
  useLazyGetTemplateCompletionDataQuery,
  useUpdateTemplateSummaryMutation,
  useUpdateLineItemDetailsMutation,
  useSaveTemplateCompletionMutation,
} = templateCompletionApi;
