import { fromApiGFCM } from "@/mappers/gfcm-mapper";
import { baseApi } from "@/store/base-api";
import type { D365GFCM, GFCM } from "../types/template";

export const GFCMApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getGFCMs: builder.query<GFCM[], string>({
      query: templateId =>
        `xomuog_gfcms?$select=xomuog_gfcmid,xomuog_gfcmcode,xomuog_name,_xomuog_templateid_value&$filter=_xomuog_templateid_value eq ${templateId}`,

      transformResponse: (response: { value: D365GFCM[] }): GFCM[] =>
        response.value.map(fromApiGFCM),
    }),
  }),
});

export const { useLazyGetGFCMsQuery, useGetGFCMsQuery } = GFCMApi;
