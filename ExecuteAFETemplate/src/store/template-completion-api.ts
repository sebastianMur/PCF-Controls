import type {
  GFCMSummaryFormData,
  LineItemDetailsFormData,
  TemplateFormData,
} from "@/forms/form-schemas";
import {
  fromApiGFCM,
  fromApiGFCMFormSummary,
  toApiGFCMSummary,
} from "@/mappers/gfcm-mapper";
import {
  fromApiLineItem,
  toApiLineItemFormDetail,
} from "@/mappers/line-item-mapper";
import {
  fromApiTemplate,
  fromApiTemplateFormSummary,
  toApiTemplateSummary,
} from "@/mappers/template-mapper";
import type {
  D365GFCM,
  D365GFCMSummary,
  D365GlobalOptionset,
  D365LineItem,
  D365Template,
  D365TemplateSummary,
  ODataEntityResponse,
  ODataGlobalOptionset,
  ODataMultipleResponse,
  TemplateCompletionData,
  Unit,
} from "../types/template";
import { baseApi } from "./base-api";
import { setTemplateSummaryId } from "./context-slice";
interface SaveTemplateCompletionResponse {
  success: boolean;
  templateSummaryId: string;
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
          const [templateRes, gfcmsRes, lineItemsRes, units] =
            await Promise.all([
              fetchWithBQ(
                `xomuog_templates?$select=xomuog_templateid,xomuog_name&$filter=xomuog_templateid eq ${templateId}`,
              ) as ODataEntityResponse<D365Template>,
              fetchWithBQ(
                `xomuog_gfcms?$select=xomuog_gfcmid,xomuog_gfcmcode,xomuog_name,_xomuog_templateid_value&$filter=_xomuog_templateid_value eq ${templateId}`,
              ) as ODataMultipleResponse<D365GFCM>,
              fetchWithBQ(
                `xomuog_lineitems?$select=xomuog_lineitemid,_xomuog_gfcmid_value,xomuog_name&$filter=xomuog_gfcmid/_xomuog_templateid_value eq ${templateId}`,
              ) as ODataMultipleResponse<D365LineItem>,
              fetchWithBQ(
                `/GlobalOptionSetDefinitions(Name='xomuog_unit')/Microsoft.Dynamics.CRM.OptionSetMetadata`,
              ) as ODataGlobalOptionset<D365GlobalOptionset>,
            ]);

          const requiredResponses = [
            templateRes,
            gfcmsRes,
            lineItemsRes,
            units,
          ];
          const firstError = requiredResponses.find(r => r.error)?.error;
          if (firstError) {
            return { error: firstError }; // ✅ only return if defined
          }

          const optionsetUnits = units?.data?.Options;
          const localUnits = optionsetUnits?.map(
            (o: D365GlobalOptionset) =>
              ({
                key: o.Value,
                value: o.Label.LocalizedLabels[0].Label,
              }) as Unit,
          );
          const data: TemplateCompletionData = {
            template: fromApiTemplate(templateRes.data as D365Template),
            gfcms: gfcmsRes?.data?.value.map(fromApiGFCM) ?? [],
            lineItems: lineItemsRes?.data?.value?.map(fromApiLineItem) ?? [],
            units: localUnits ?? [],
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

    saveTemplateCompletion: builder.mutation<
      SaveTemplateCompletionResponse,
      TemplateFormData
    >({
      async queryFn(data, _api, _extraOptions, fetchWithBQ) {
        try {
          const { templateSummary, gfcmSummary, lineItemsDetails, isNew } =
            data;

          if (!templateSummary) {
            return {
              error: {
                status: 400,
                data: { message: "Template summary is required." },
              },
            };
          }

          let templateSummaryId = templateSummary.xomuog_templatesummaryid;

          const templateSummaryUrl = isNew
            ? "xomuog_templatesummaries"
            : `xomuog_templatesummaries(${templateSummaryId})`;

          const templateSummaryResult = await fetchWithBQ({
            url: templateSummaryUrl,
            method: isNew ? "POST" : "PATCH",
            body: toApiTemplateSummary(templateSummary),
            headers: {
              Prefer: "return=representation",
            },
          });

          if (templateSummaryResult.error) {
            return { error: templateSummaryResult.error };
          }
          templateSummaryId = fromApiTemplateFormSummary(
            templateSummaryResult?.data as D365TemplateSummary,
          )?.xomuog_templatesummaryid;

          let transformedGFCMResults: GFCMSummaryFormData[] = [];
          if (gfcmSummary && gfcmSummary.length > 0) {
            const newGFCMSummary = gfcmSummary.map(gfcmSumm => ({
              ...gfcmSumm,
              xomuog_templatesummaryid: templateSummaryId,
            }));

            const gfcmResults = await Promise.all(
              newGFCMSummary.map(gfcmSummary => {
                const url = isNew
                  ? "xomuog_gfcmsummaries"
                  : `xomuog_gfcmsummaries(${gfcmSummary.xomuog_gfcmsummaryid})`;

                return fetchWithBQ({
                  url,
                  method: isNew ? "POST" : "PATCH",
                  body: toApiGFCMSummary(gfcmSummary),
                  headers: {
                    Prefer: "return=representation",
                  },
                });
              }),
            );

            transformedGFCMResults = gfcmResults.map(gfcmSumm => {
              return fromApiGFCMFormSummary(gfcmSumm.data as D365GFCMSummary);
            });

            const failed = gfcmResults.find(r => r.error);
            if (failed?.error) return { error: failed.error };
          }

          if (lineItemsDetails && lineItemsDetails.length > 0) {
            const detailResults = await Promise.all(
              lineItemsDetails.map(item => {
                const gfcm = gfcmSummary?.find(
                  gfcm =>
                    gfcm.xomuog_gfcmsummaryid === item.xomuog_gfcmsummaryid,
                );
                const gfcmSummaryId = transformedGFCMResults.find(
                  r => r.xomuog_gfcmid === gfcm?.xomuog_gfcmid,
                )?.xomuog_gfcmsummaryid;
                const updatedLineItem = {
                  ...item,
                  xomuog_gfcmsummaryid: gfcmSummaryId,
                } as LineItemDetailsFormData;

                const isNewDetail = !item.xomuog_lineitemdetailid;
                const url = isNewDetail
                  ? "xomuog_lineitemdetails"
                  : `xomuog_lineitemdetails(${item.xomuog_lineitemdetailid})`;

                return fetchWithBQ({
                  url,
                  method: isNewDetail ? "POST" : "PATCH",
                  body: toApiLineItemFormDetail(updatedLineItem),
                  headers: {
                    Prefer: "return=representation",
                  },
                });
              }),
            );

            const failed = detailResults.find(r => r.error);
            if (failed?.error) return { error: failed.error };
          }

          return {
            data: {
              success: true,
              templateSummaryId,
            },
          };
        } catch (e) {
          return {
            error: {
              status: 500,
              data: { message: "Save failed" },
            },
          };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setTemplateSummaryId(data.templateSummaryId));
      },
      invalidatesTags: ["gfcmSummary", "lineItemsDetail", "templateSummary"],
    }),

    sendToAFEExecute: builder.mutation<void, string>({
      query: wpnid => ({
        url: "xomuog_apiwpnsendexecuteaferecord",
        method: "POST",
        body: JSON.stringify({ wpnid }),
        headers: {
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetTemplateCompletionDataQuery,
  useLazyGetTemplateCompletionDataQuery,
  useSaveTemplateCompletionMutation,
  useSendToAFEExecuteMutation,
} = templateCompletionApi;
