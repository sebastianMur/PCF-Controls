import type { TemplateFormData } from "@/forms/form-schemas";
import { fromApiGFCM, toApiGFCMSummary } from "@/mappers/gfcm-mapper";
import {
  fromApiLineItem,
  toApiLineItemFormDetail,
} from "@/mappers/line-item-mapper";
import {
  fromApiTemplate,
  toApiTemplateSummary,
} from "@/mappers/template-mapper";
import type {
  D365GFCM,
  D365GlobalOptionset,
  D365LineItem,
  D365Template,
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
      providesTags: ["template"],
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

          const templateBody = toApiTemplateSummary(templateSummary);

          const boundary = `batch_${Date.now()}`;
          const changeset = `changeset_${Date.now()}`;
          const parts: string[] = [];
          let contentId = 1;

          // === Start batch & changeset ===
          parts.push(`--${boundary}`);
          parts.push(`Content-Type: multipart/mixed;boundary=${changeset}`);
          parts.push("");

          // 1️⃣ TEMPLATE SUMMARY
          const templateContentId = contentId;
          parts.push(`--${changeset}`);
          parts.push("Content-Type: application/http");
          parts.push("Content-Transfer-Encoding: binary");
          parts.push(`Content-ID: ${contentId}`);
          parts.push("");
          parts.push(
            `${isNew ? "POST" : "PATCH"} ${
              isNew
                ? "xomuog_templatesummaries"
                : `xomuog_templatesummaries(${templateSummary.xomuog_templatesummaryid})`
            } HTTP/1.1`,
          );
          parts.push("Content-Type: application/json;type=entry");
          parts.push("");
          parts.push(JSON.stringify(templateBody));
          parts.push("");
          contentId++;

          // 2️⃣ GFCM SUMMARIES
          const gfcmContentIds: number[] = [];
          for (const gfcm of gfcmSummary || []) {
            const gfcmSummaryBody = toApiGFCMSummary(gfcm);

            const isNewGfcm = !gfcm.xomuog_gfcmsummaryid;
            parts.push(`--${changeset}`);
            parts.push("Content-Type: application/http");
            parts.push("Content-Transfer-Encoding: binary");
            parts.push(`Content-ID: ${contentId}`);
            parts.push("");
            parts.push(
              `${isNewGfcm ? "POST" : "PATCH"} ${
                isNewGfcm
                  ? "xomuog_gfcmsummaries"
                  : `xomuog_gfcmsummaries(${gfcm.xomuog_gfcmsummaryid})`
              } HTTP/1.1`,
            );
            parts.push("Content-Type: application/json;type=entry");
            parts.push("");

            // referenciar template si es nuevo
            const gfcmBodyWithLink = isNew
              ? {
                  ...gfcmSummaryBody,
                  "xomuog_templatesummaryid@odata.bind": `$${templateContentId}`,
                }
              : {
                  ...gfcmSummaryBody,
                  "xomuog_templatesummaryid@odata.bind": `/xomuog_templatesummaries(${templateSummary.xomuog_templatesummaryid})`,
                };

            parts.push(JSON.stringify(gfcmBodyWithLink));
            parts.push("");
            gfcmContentIds.push(contentId);
            contentId++;
          }

          // 3️⃣ LINE ITEMS
          for (const lineItem of lineItemsDetails || []) {
            const sendLineItemDetail = toApiLineItemFormDetail(lineItem);

            const gfcmIndex =
              gfcmSummary?.findIndex(
                gfcm =>
                  gfcm.xomuog_gfcmsummaryid === lineItem.xomuog_gfcmsummaryid,
              ) || 0;

            const relatedGfcmId =
              gfcmContentIds[gfcmIndex] || gfcmContentIds[0];

            parts.push(`--${changeset}`);
            parts.push("Content-Type: application/http");
            parts.push("Content-Transfer-Encoding: binary");
            parts.push(`Content-ID: ${contentId}`);
            parts.push("");
            parts.push(
              `${isNew ? "POST" : "PATCH"} ${
                isNew
                  ? "xomuog_lineitemdetails"
                  : `xomuog_lineitemdetails(${lineItem.xomuog_lineitemdetailid})`
              } HTTP/1.1`,
            );
            parts.push("Content-Type: application/json;type=entry");
            parts.push("");

            const lineItemBodyWithLink = gfcmSummary?.[gfcmIndex]
              ?.xomuog_gfcmsummaryid
              ? {
                  ...sendLineItemDetail,
                  "xomuog_gfcmsummaryid@odata.bind": `/xomuog_gfcmsummaries(${gfcmSummary[gfcmIndex].xomuog_gfcmsummaryid})`,
                }
              : {
                  ...sendLineItemDetail,
                  "xomuog_gfcmsummaryid@odata.bind": `$${relatedGfcmId}`,
                };

            parts.push(JSON.stringify(lineItemBodyWithLink));
            parts.push("");
            contentId++;
          }

          // === Close changeset & batch ===
          parts.push(`--${changeset}--`);
          parts.push(`--${boundary}--`);
          const body = parts.join("\r\n");

          const batchResult = await fetchWithBQ({
            url: "$batch",
            method: "POST",
            headers: {
              "Content-Type": `multipart/mixed;boundary=${boundary}`,
              Prefer: "return=representation",
            },
            body,
            responseHandler: "text", // 👈 prevent JSON parsing
          });

          if (batchResult.error) {
            return { error: batchResult.error };
          }

          const responseText = batchResult.data as string;
          if (!responseText.includes("HTTP/1.1 20")) {
            return {
              error: {
                status: 500,
                data: { message: "Batch request failed." },
              },
            };
          }

          // Match TemplateSummary ID from either the OData-EntityId or JSON body
          const match = responseText.match(
            /xomuog_templatesummaries\(([\w-]+)\)/i,
          );

          let newTemplateSummaryId = "";

          if (match?.[1]) {
            newTemplateSummaryId = match[1];
          } else {
            // Fallback: try to extract from JSON in case of "return=representation"
            const jsonMatch = responseText.match(
              /"xomuog_templatesummaryid"\s*:\s*"([\w-]+)"/i,
            );
            if (jsonMatch?.[1]) {
              newTemplateSummaryId = jsonMatch[1];
            }
          }
          return {
            data: {
              success: true,
              templateSummaryId: newTemplateSummaryId,
            },
          };
        } catch (e) {
          return {
            error: { status: 500, data: { message: "Batch save failed." } },
          };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        if (data?.templateSummaryId) {
          dispatch(setTemplateSummaryId(data.templateSummaryId));
        }
      },
      invalidatesTags: ["gfcmSummary", "lineItemsDetail", "templateSummary"],
    }),

    sendToAFEExecute: builder.mutation<string, string>({
      query: templatesummary => ({
        url: "xomuog_apiwpnsendexecuteaferecord",
        method: "POST",
        body: JSON.stringify({ templatesummary }),
        headers: {
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
      }),
      transformResponse: (response: {
        Tracing: string;
        executeafeapiresponse: string;
      }) => {
        return response.executeafeapiresponse;
      },
    }),
  }),
});

export const {
  useGetTemplateCompletionDataQuery,
  useLazyGetTemplateCompletionDataQuery,
  useSaveTemplateCompletionMutation,
  useSendToAFEExecuteMutation,
} = templateCompletionApi;
