import type { LineItemDetailsFormData } from "@/forms/form-schemas";
import { fromApiLineItemFormDetail } from "@/mappers/line-item-mapper";
import { baseApi } from "@/store/base-api";
import type { D365LineItemDetails } from "@/types/template";

export const LineItemDetailsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLineItemsDetails: builder.query<LineItemDetailsFormData[], string>({
      query: templateSummaryId =>
        `xomuog_lineitemdetails?$select=xomuog_lineitemdetailid,_xomuog_gfcmsummaryid_value,_xomuog_lineitem_value,xomuog_name,xomuog_quantity,xomuog_total,xomuog_unit,xomuog_unitprice&$filter=xomuog_gfcmsummaryid/_xomuog_templatesummaryid_value eq ${templateSummaryId}`,
      transformResponse: (response: {
        value: D365LineItemDetails[];
      }): LineItemDetailsFormData[] =>
        response.value.map(fromApiLineItemFormDetail),
    }),
  }),
});

export const { useLazyGetLineItemsDetailsQuery, useGetLineItemsDetailsQuery } =
  LineItemDetailsApi;
