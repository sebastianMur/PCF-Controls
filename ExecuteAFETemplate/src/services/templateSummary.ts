import { fromApiTemplateFormSummary } from "@/mappers/template-mapper";

import type { TemplateSummaryFormData } from "@/forms/form-schemas";
import { baseApi } from "@/store/base-api";
import type {
  D365TemplateSummary,
  SendTemplateSummary,
} from "../types/template";

type APICall = { tracing: string; response: string };

export const templateSummaryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTemplateSummary: builder.query<TemplateSummaryFormData, string>({
      query: templateSummaryId =>
        `xomuog_templatesummaries(${templateSummaryId})?$select=xomuog_templatesummaryid,xomuog_capexopex,xomuog_companycode,xomuog_costcenter,xomuog_descriptionscopeofwork,xomuog_afedocumentid,xomuog_aferecordurl,xomuog_isfilereplaced,_xomuog_engineerid_value,exchangerate,xomuog_grandtotal,xomuog_grandtotal_base,_xomuog_landmanid_value,xomuog_mainprojecttype,_xomuog_operator_value,xomuog_projectdescription,xomuog_name,xomuog_projectnumber,xomuog_specialinstructions,xomuog_subprojecttype,_xomuog_templateid_value,_xomuog_wpnid_value,statuscode,xomuog_afeexecutebusinessunit,_xomuog_projectteam_value`,

      transformResponse: (
        response: D365TemplateSummary,
      ): TemplateSummaryFormData => fromApiTemplateFormSummary(response),
    }),

    getAFEStatus: builder.query<string, string>({
      query: templateSummaryId =>
        `xomuog_getAFEStatus(templatesummaryid=@templatesummaryid)?@templatesummaryid=${templateSummaryId}`,

      transformResponse: (response: APICall) => response.response,
    }),

    sendAFEForRevision: builder.mutation<
      string, // ✅ Solo queremos el campo `response` (string)
      { templatesummaryid: string } // Parámetro de entrada
    >({
      query: body => ({
        url: "xomuog_SendAFEForRevision",
        method: "POST",
        body,
      }),
      transformResponse: (response: { response?: string }) =>
        response?.response ?? "",
    }),

    updateTemplateSummary: builder.mutation<
      void,
      {
        record: SendTemplateSummary;
        templateSummaryId: string;
      }
    >({
      query: ({ record, templateSummaryId }) => ({
        url: `xomuog_templatesummaries(${templateSummaryId})`,
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify(record),
      }),
      invalidatesTags: ["templateSummary"],
    }),
  }),
});

export const {
  useLazyGetTemplateSummaryQuery,
  useGetTemplateSummaryQuery,
  useUpdateTemplateSummaryMutation,
  useGetAFEStatusQuery,
  useLazyGetAFEStatusQuery,
  useSendAFEForRevisionMutation,
} = templateSummaryApi;
