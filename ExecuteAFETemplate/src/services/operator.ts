import { fromApiOperator } from "@/mappers/operator-mapper";
import { baseApi } from "@/store/base-api";
import type { D365Operator, Operator } from "../types/template";

export const operatorApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOperator: builder.query<Operator, void>({
      query: () =>
        `xomuog_operators?$select=xomuog_operatorid,xomuog_name,xomuog_number,statuscode&$filter=xomuog_number eq '99994331'`,

      transformResponse: (response: { value?: D365Operator[] }): Operator =>
        fromApiOperator(response.value?.[0] ?? ({} as D365Operator)),
    }),
  }),
});

export const { useLazyGetOperatorQuery, useGetOperatorQuery } = operatorApi;
