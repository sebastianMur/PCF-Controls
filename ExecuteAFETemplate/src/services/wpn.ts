import { fromApiWPN } from "@/mappers/wpn-mapper";
import { baseApi } from "@/store/base-api";
import type { D365WPN, WPN } from "../types/template";

export const wpnApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getWPN: builder.query<WPN, string>({
      query: wpnId => ({
        url: `xomuog_wellproblemnotifications(${wpnId})?$select=xomuog_wellproblemnotificationid,xomuog_primaryjobtype_ee,_xomuog_engineerid_value,_xomuog_landman_value,xomuog_secondaryjobtype_ee,_xomuog_templateid_value,_xomuog_templatesummaryid_value,_xomuog_wellid_value&$expand=xomuog_wellid($select=xomuog_wellid,xomuog_sap_costcenter)`,
        headers: {
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Prefer: "odata.include-annotations=*",
        },
      }),

      transformResponse: (response: D365WPN): WPN => fromApiWPN(response),
    }),
  }),
});

export const { useLazyGetWPNQuery, useGetWPNQuery } = wpnApi;
