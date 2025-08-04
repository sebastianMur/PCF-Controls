import type { GFCMSummaryFormData } from "@/forms/form-schemas";
import { fromApiGFCMFormSummary } from "@/mappers/gfcm-mapper";
import { baseApi } from "@/store/base-api";
import type { D365GFCMSummary } from "@/types/template";

export const GFCMSummaryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getGFCMSummarys: builder.query<GFCMSummaryFormData[], string>({
      query: templateSummaryId =>
        `xomuog_gfcmsummaries?$select=xomuog_gfcmsummaryid,_xomuog_gfcmid_value,xomuog_name,xomuog_total&$filter=_xomuog_templatesummaryid_value eq ${templateSummaryId}`,

      transformResponse: (response: {
        value: D365GFCMSummary[];
      }): GFCMSummaryFormData[] => response.value.map(fromApiGFCMFormSummary),
    }),
  }),
});

export const { useLazyGetGFCMSummarysQuery, useGetGFCMSummarysQuery } =
  GFCMSummaryApi;
