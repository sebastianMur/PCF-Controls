import { fromApiLineItem } from "@/mappers/line-item-mapper";
import { baseApi } from "@/store/base-api";
import type { D365LineItem, LineItem } from "../types/template";

export const LineItemApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLineItem: builder.query<LineItem[], string>({
      query: templateId =>
        `xomuog_lineitems?$select=xomuog_lineitemid,_xomuog_gfcmid_value,xomuog_name&$filter=xomuog_gfcmid/_xomuog_templateid_value eq ${templateId}`,
      transformResponse: (response: { value: D365LineItem[] }): LineItem[] =>
        response.value.map(fromApiLineItem),
    }),
  }),
});

export const { useLazyGetLineItemQuery, useGetLineItemQuery } = LineItemApi;
