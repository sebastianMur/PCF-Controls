// import type {
//   FetchBaseQueryError,
//   FetchBaseQueryMeta,
//   QueryReturnValue,
// } from "@reduxjs/toolkit/query/react";
// import type {
//   Attachment,
//   GFCM,
//   GFCMSummary,
//   LineItem,
//   LineItemDetails,
//   Template,
//   TemplateCompletionData,
//   TemplateSummary,
//   Unit,
//   WPN,
// } from "../types/template";
// import { baseApi } from "./base-api";

// // Mock data
// const mockUnits: Unit[] = [
//   { key: 1, value: "Per day" },
//   { key: 2, value: "Per hour" },
//   { key: 3, value: "Per foot" },
//   { key: 5, value: "Each" },
// ];

// const mockWPNs: WPN[] = [
//   { wpnId: "WPN001", name: "Project Alpha" },
//   { wpnId: "WPN002", name: "Project Beta" },
// ];

// const mockGFCMs: GFCM[] = [
//   { GFCMID: "GFCM001", name: "Construction Materials", templateId: "TMPL001" },
//   { GFCMID: "GFCM002", name: "Labor Services", templateId: "TMPL001" },
//   { GFCMID: "GFCM003", name: "Equipment Rental", templateId: "TMPL001" },
// ];

// const mockTemplates: Template[] = [
//   { templateId: "TMPL001", name: "Standard Construction Template" },
// ];

// const mockLineItems: LineItem[] = [
//   { lineItemId: "LI001", gfcmId: "GFCM001", name: "Site Clearing" },
//   { lineItemId: "LI002", gfcmId: "GFCM001", name: "Soil Excavation" },
//   { lineItemId: "LI003", gfcmId: "GFCM002", name: "Foundation Pour" },
//   { lineItemId: "LI004", gfcmId: "GFCM003", name: "Steel Beams" },
// ];

// const mockTemplateSummary: TemplateSummary = {
//   templateSummaryId: "TS001",
//   templateId: "TMPL001",
//   wpnId: "WPN001",
//   grandTotal: 0,
//   name: "Project Alpha - Construction Template",
// };

// const mockGFCMSummaries: GFCMSummary[] = [
//   {
//     templateSummaryId: "TMPL001",
//     gfcmSummaryId: "SS001",
//     gfcmId: "GFCM001",
//     total: 0,
//   },
//   {
//     templateSummaryId: "TMPL001",

//     gfcmSummaryId: "SS002",
//     gfcmId: "GFCM002",
//     total: 0,
//   },
//   {
//     templateSummaryId: "TMPL001",
//     gfcmSummaryId: "SS003",
//     gfcmId: "GFCM003",
//     total: 0,
//   },
// ];

// const mockLineItemDetails: LineItemDetails[] = [
//   {
//     lineItemDetailId: "LID001",
//     lineItemId: "LI001",
//     gfcmSummaryId: "SS001",
//     quantity: 0,
//     unitPrice: 150.0,
//     unit: mockUnits[0],
//     total: 0,
//   },
//   {
//     lineItemDetailId: "LID002",
//     lineItemId: "LI002",
//     gfcmSummaryId: "SS001",
//     quantity: 0,
//     unitPrice: 200.0,
//     unit: mockUnits[2],
//     total: 0,
//   },
//   {
//     lineItemDetailId: "LID003",
//     lineItemId: "LI003",
//     gfcmSummaryId: "SS002",
//     quantity: 0,
//     unitPrice: 500.0,
//     unit: mockUnits[3],
//     total: 0,
//   },
//   {
//     lineItemDetailId: "LID004",
//     lineItemId: "LI004",
//     gfcmSummaryId: "SS003",
//     quantity: 0,
//     unitPrice: 800.0,
//     unit: mockUnits[3],
//     total: 0,
//   },
// ];

// // In-memory storage for attachments (in a real app, this would be in a database)
// const mockAttachments: Attachment[] = [];

// interface SaveTemplateCompletionResponse {
//   success: boolean;
// }

// export const templateCompletionApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     getTemplateCompletionData: builder.query<
//       TemplateCompletionData | undefined,
//       string
//     >({
//       queryFn: async (
//         templateId,
//         _api,
//         _extraOptions,
//         _baseQuery,
//       ): Promise<
//         QueryReturnValue<
//           TemplateCompletionData,
//           FetchBaseQueryError,
//           FetchBaseQueryMeta
//         >
//       > => {
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         const template = mockTemplates.find(t => t.templateId === templateId);

//         if (!template) {
//           return {
//             error: {
//               status: 404,
//               data: { message: "Template not found" }, // mock error structure
//             },
//           };
//         }

//         const data: TemplateCompletionData = {
//           template,
//           templateSummary: mockTemplateSummary,
//           lineItems: mockLineItems,
//           gfcms: mockGFCMs,
//           wpns: mockWPNs,
//           gfcmSummaries: mockGFCMSummaries,
//           lineItemDetails: mockLineItemDetails,
//           attachments: mockAttachments.filter(
//             att =>
//               att.templateSummaryId === mockTemplateSummary.templateSummaryId,
//           ),
//           units: mockUnits,
//         };

//         return { data };
//       },
//       providesTags: ["TemplateCompletion", "Attachment"],
//     }),

//     updateTemplateSummary: builder.mutation<
//       TemplateSummary,
//       Partial<TemplateSummary> & { templateSummaryId: string }
//     >({
//       queryFn: async updates => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         const updatedSummary = { ...mockTemplateSummary, ...updates };
//         return { data: updatedSummary };
//       },
//       invalidatesTags: ["TemplateCompletion"],
//     }),

//     updateLineItemDetails: builder.mutation<
//       LineItemDetails[],
//       LineItemDetails[]
//     >({
//       queryFn: async lineItemDetails => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { data: lineItemDetails };
//       },
//       invalidatesTags: ["TemplateCompletion"],
//     }),

//     saveTemplateCompletion: builder.mutation<
//       SaveTemplateCompletionResponse,
//       TemplateCompletionData
//     >({
//       queryFn: async data => {
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         console.log("Saving template completion data:", data);
//         return { data: { success: true } };
//       },
//       invalidatesTags: ["TemplateCompletion"],
//     }),
//   }),
// });

// export const {
//   useGetTemplateCompletionDataQuery,
//   useLazyGetTemplateCompletionDataQuery,
//   useUpdateTemplateSummaryMutation,
//   useUpdateLineItemDetailsMutation,
//   useSaveTemplateCompletionMutation,
// } = templateCompletionApi;

import {
  fromApiGFCM,
  fromApiLineItem,
  fromApiTemplate,
} from "@/mappers/template-mapper";
import { v4 as uuidv4 } from "uuid";
import type {
  D365GFCM,
  D365LineItem,
  D365Template,
  GFCMSummary,
  LineItemDetails,
  TemplateCompletionData,
  TemplateSummary,
  Unit,
} from "../types/template";
import { baseApi } from "./base-api";
interface SaveTemplateCompletionResponse {
  success: boolean;
}

const mockUnits: Unit[] = [
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
              `new_templates(${templateId})?$select=new_templateid,new_name`,
            ),
            fetchWithBQ(
              `new_gfcms?$select=new_gfcmid,new_gfcmcode,new_name,_new_templateid_value&$filter=_new_templateid_value eq ${templateId}`,
            ),
            fetchWithBQ(
              `/new_lineitems?$select=new_lineitemid,_new_gfcmid_value,new_name&$filter=new_gfcmid/_new_templateid_value eq ${templateId}`,
            ),
          ]);

          const requiredResponses = [templateRes, gfcmsRes, lineItemsRes];
          if (requiredResponses.some(r => r.error)) {
            return {
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              error: requiredResponses.find(r => r.error)?.error as any,
            };
          }

          // Optional fetches: templateSummary and downstream
          let templateSummary: TemplateSummary | undefined = undefined;
          let gfcmSummaries: GFCMSummary[] = [];
          let lineItemDetails = [];
          let attachments = [];

          if (templateSummaryId) {
            const [summaryRes, gfcmSummariesRes, detailsRes, attachmentsRes] =
              await Promise.all([
                fetchWithBQ(
                  `new_templatesummaries(${templateSummaryId})?$select=new_templatesummaryid,new_grandtotal,new_name,_new_templateid_value,_new_wpnid_value`,
                ),
                fetchWithBQ(
                  `new_gfcmsummaries?$select=new_gfcmsummaryid,_new_gfcmid_value,new_name,_new_templatesummaryid_value,new_total&$filter=_new_templatesummaryid_value eq ${templateSummaryId}`,
                ),
                fetchWithBQ(
                  `new_lineitemdetails?$select=new_lineitemdetailid,_new_gfcmsummaryid_value,_new_lineitem_value,new_name,new_quantity,new_total,new_unit,new_unitprice&$filter=_new_templatesummaryid_value eq ${templateSummaryId}`,
                ),
                fetchWithBQ(
                  `annotations?$select=annotationid,notetext,documentbody,filename,filesize,mimetype,objecttypecode,_objectid_value,subject&$filter=_objectid_value eq ${templateSummaryId} and objecttypecode eq 'new_templatesummary'`,
                ),
              ]);

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            if (!summaryRes.error) templateSummary = summaryRes.data as any;
            if (!gfcmSummariesRes.error)
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              gfcmSummaries = (gfcmSummariesRes.data ?? []) as any;
            if (!detailsRes.error)
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              lineItemDetails = (detailsRes.data ?? []) as any;
            if (!attachmentsRes.error)
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              attachments = (attachmentsRes.data ?? []) as any;
          } else {
            templateSummary = {
              grandTotal: 0,
              name: fromApiTemplate(templateRes.data as D365Template).name,
              templateId: fromApiTemplate(templateRes.data as D365Template)
                .templateId,
              templateSummaryId: uuidv4(),
            } as TemplateSummary;

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            gfcmSummaries = ((gfcmsRes.data as any).value as D365GFCM[]).map(
              gfcm => {
                return {
                  gfcmId: gfcm.new_gfcmid,
                  gfcmSummaryId: uuidv4(),
                  templateSummaryId: templateSummary?.templateSummaryId,
                  total: 0,
                } as GFCMSummary;
              },
            );
            lineItemDetails =
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              ((lineItemsRes.data as any).value as D365LineItem[]).map(
                lineItem => {
                  const matchGFCM = (
                    (gfcmSummaries ?? []) as GFCMSummary[]
                  )?.find(
                    gfcmSummary =>
                      gfcmSummary.gfcmId === lineItem._new_gfcmid_value,
                  );

                  return {
                    gfcmSummaryId: matchGFCM?.gfcmSummaryId,
                    lineItemId: lineItem.new_lineitemid,
                    lineItemDetailId: uuidv4(),
                    quantity: 0,
                    total: 0,
                    unit: mockUnits[0].key,
                    unitPrice: 0,
                  } as LineItemDetails;
                },
              );
          }

          const data: TemplateCompletionData = {
            template: fromApiTemplate(templateRes.data as D365Template),
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            gfcms: (gfcmsRes?.data as any).value.map(fromApiGFCM),
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            lineItems: (lineItemsRes?.data as any).value.map(fromApiLineItem),
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            templateSummary: templateSummary as any,
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
      providesTags: ["TemplateCompletion", "Attachment"],
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
      invalidatesTags: ["TemplateCompletion"],
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
                url: `new_lineitemdetails(${d.lineItemDetailId})`,
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
      invalidatesTags: ["TemplateCompletion"],
    }),

    saveTemplateCompletion: builder.mutation<
      SaveTemplateCompletionResponse,
      TemplateCompletionData
    >({
      queryFn: async (data, _api, _extra) => {
        try {
          console.log(
            "Saving template completion for:",
            data.template.templateId,
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
      invalidatesTags: ["TemplateCompletion"],
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
