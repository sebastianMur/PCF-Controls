import { fromApiTemplateFormSummary } from "@/mappers/template-mapper";

import type { TemplateSummaryFormData } from "@/forms/form-schemas";
import { baseApi } from "@/store/base-api";
import type { D365TemplateSummary } from "../types/template";

export const templateSummaryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTemplateSummary: builder.query<TemplateSummaryFormData, string>({
      query: templateSummaryId =>
        `xomuog_templatesummaries(${templateSummaryId})?$select=xomuog_templatesummaryid,xomuog_capexopex,xomuog_companycode,xomuog_costcenter,xomuog_descriptionscopeofwork,xomuog_engineer,exchangerate,xomuog_grandtotal,xomuog_grandtotal_base,xomuog_landman,xomuog_mainprojecttype,_xomuog_operator_value,xomuog_projectdescription,xomuog_name,xomuog_projectnumber,xomuog_specialinstruction,xomuog_subprojecttype,_xomuog_templateid_value,_xomuog_wpnid_value`,

      transformResponse: (
        response: D365TemplateSummary,
      ): TemplateSummaryFormData => fromApiTemplateFormSummary(response),
    }),
  }),
});

export const { useLazyGetTemplateSummaryQuery, useGetTemplateSummaryQuery } =
  templateSummaryApi;
