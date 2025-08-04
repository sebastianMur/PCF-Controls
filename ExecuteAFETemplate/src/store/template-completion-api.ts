import { fromApiGFCM, fromApiGFCMSummary } from "@/mappers/gfcm-mapper";
import {
  fromApiLineItem,
  fromApiLineItemDetail,
} from "@/mappers/line-item-mapper";
import {
  fromApiTemplate,
  fromApiTemplateSummary,
} from "@/mappers/template-mapper";
import { v4 as uuidv4 } from "uuid";
import type {
  D365Attachment,
  D365GFCM,
  D365GFCMSummary,
  D365LineItem,
  D365LineItemDetails,
  D365Template,
  D365TemplateSummary,
  GFCMSummary,
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
      async queryFn(
        { templateId, templateSummaryId },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) {
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
          // Optional fetches: templateSummary and downstream
          let templateSummary: TemplateSummary | undefined = undefined;
          let gfcmSummaries: GFCMSummary[] = [];
          let lineItemDetails: LineItemDetails[] = [];
          let attachments = [];

          if (templateSummaryId) {
            const [summaryRes, gfcmSummariesRes, detailsRes, attachmentsRes] =
              await Promise.all([
                fetchWithBQ(
                  `xomuog_templatesummaries(${templateSummaryId})?$select=xomuog_templatesummaryid,xomuog_capexopex,xomuog_companycode,xomuog_costcenter,xomuog_descriptionscopeofwork,xomuog_engineer,exchangerate,xomuog_grandtotal,xomuog_grandtotal_base,xomuog_landman,xomuog_mainprojecttype,_xomuog_operator_value,xomuog_projectdescription,xomuog_name,xomuog_projectnumber,xomuog_specialinstruction,xomuog_subprojecttype,_xomuog_templateid_value,_xomuog_wpnid_value`,
                ) as ODataEntityResponse<D365TemplateSummary>,
                fetchWithBQ(
                  `xomuog_gfcmsummaries?$select=xomuog_gfcmsummaryid,_xomuog_gfcmid_value,xomuog_name,xomuog_total&$filter=_xomuog_templatesummaryid_value eq ${templateSummaryId}`,
                ) as ODataMultipleResponse<D365GFCMSummary>,
                fetchWithBQ(
                  `xomuog_lineitemdetails?$select=xomuog_lineitemdetailid,_xomuog_gfcmsummaryid_value,_xomuog_lineitem_value,xomuog_name,xomuog_quantity,xomuog_total,xomuog_unit,xomuog_unitprice&$filter=xomuog_gfcmsummaryid/_xomuog_templatesummaryid_value eq ${templateSummaryId}`,
                ) as ODataMultipleResponse<D365LineItemDetails>,
                fetchWithBQ(
                  `annotations?$select=annotationid,notetext,documentbody,filename,filesize,mimetype,objecttypecode,_objectid_value,subject&$filter=_objectid_value eq ${templateSummaryId} and objecttypecode eq 'new_templatesummary'`,
                ) as ODataMultipleResponse<D365Attachment>,
              ]);

            if (!summaryRes.error && summaryRes.data)
              templateSummary = fromApiTemplateSummary(summaryRes.data);

            if (!gfcmSummariesRes.error && gfcmSummariesRes.data)
              gfcmSummaries = gfcmSummariesRes?.data?.value?.map(g =>
                fromApiGFCMSummary(g),
              );
            if (!detailsRes.error && detailsRes.data)
              lineItemDetails = detailsRes?.data?.value?.map(d =>
                fromApiLineItemDetail(d),
              );

            if (!attachmentsRes.error && attachmentsRes.data)
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              attachments = (attachmentsRes.data ?? []) as any;
          } else {
            templateSummary = {
              xomuog_grandtotal: 0,
              xomuog_name: fromApiTemplate(templateRes.data as D365Template)
                .xomuog_name,
              xomuog_templateid: fromApiTemplate(
                templateRes.data as D365Template,
              ).xomuog_templateid,
              xomuog_templatesummaryid: uuidv4(),
            } as TemplateSummary;

            gfcmSummaries =
              gfcmsRes?.data?.value && gfcmsRes?.data?.value?.length > 0
                ? gfcmsRes?.data?.value.map(gfcm => {
                    return {
                      xomuog_gfcmid: gfcm.xomuog_gfcmid,
                      xomuog_gfcmsummaryid: uuidv4(),
                      xomuog_templatesummaryid:
                        templateSummary?.xomuog_templatesummaryid,
                      xomuog_total: 0,
                    } as GFCMSummary;
                  })
                : [];
            lineItemDetails =
              lineItemsRes?.data?.value && lineItemsRes?.data?.value?.length > 0
                ? lineItemsRes.data.value.map(lineItem => {
                    const matchGFCM = (
                      (gfcmSummaries ?? []) as GFCMSummary[]
                    )?.find(
                      gfcmSummary =>
                        gfcmSummary.xomuog_gfcmid ===
                        lineItem._xomuog_gfcmid_value,
                    );

                    return {
                      xomuog_gfcmsummaryid: matchGFCM?.xomuog_gfcmsummaryid,
                      xomuog_lineitem: lineItem.xomuog_lineitemid,
                      xomuog_lineitemdetailid: uuidv4(),
                      xomuog_quantity: 0,
                      xomuog_total: 0,
                      xomuog_unit: mockUnits[0].key,
                      xomuog_unitprice: 0,
                    };
                  })
                : [];
          }

          const data: TemplateCompletionData = {
            template: fromApiTemplate(templateRes.data as D365Template),
            gfcms: gfcmsRes?.data?.value.map(fromApiGFCM) ?? [],
            lineItems: lineItemsRes?.data?.value?.map(fromApiLineItem) ?? [],
            templateSummary: templateSummary as TemplateSummary,
            gfcmSummaries,
            lineItemDetails,
            attachments,
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
      TemplateCompletionData
    >({
      queryFn: async (data, _api, _extra) => {
        try {
          console.log(
            "Saving template completion for:",
            data.template.xomuog_templateid,
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
