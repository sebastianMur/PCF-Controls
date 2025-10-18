import { fromApiTemplate } from "@/mappers/template-mapper";
import { baseApi } from "@/store/base-api";
import type { D365Template, Template } from "../types/template";

export const templateApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTemplate: builder.query<Template, string>({
      query: templateId =>
        `xomuog_templates(${templateId})?$select=xomuog_templateid,xomuog_name,xomuog_templatename,xomuog_type`,

      transformResponse: (response: D365Template): Template =>
        fromApiTemplate(response),
    }),
  }),
});

export const { useLazyGetTemplateQuery, useGetTemplateQuery } = templateApi;
