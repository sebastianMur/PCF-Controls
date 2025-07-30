import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import type {
  Attachment,
  GFCM,
  GFCMSummary,
  LineItem,
  LineItemDetails,
  Template,
  TemplateCompletionData,
  TemplateSummary,
  Unit,
  WPN,
} from "../types/template";
import { baseApi } from "./base-api";

// Mock data
const mockUnits: Unit[] = [
  { key: 1, value: "Per day" },
  { key: 2, value: "Per hour" },
  { key: 3, value: "Per foot" },
  { key: 5, value: "Each" },
];

const mockWPNs: WPN[] = [
  { wpnId: "WPN001", name: "Project Alpha" },
  { wpnId: "WPN002", name: "Project Beta" },
];

const mockGFCMs: GFCM[] = [
  { GFCMID: "GFCM001", name: "Construction Materials", templateId: "TMPL001" },
  { GFCMID: "GFCM002", name: "Labor Services", templateId: "TMPL001" },
  { GFCMID: "GFCM003", name: "Equipment Rental", templateId: "TMPL001" },
];

const mockTemplates: Template[] = [
  { templateId: "TMPL001", name: "Standard Construction Template" },
];

const mockLineItems: LineItem[] = [
  { lineItemId: "LI001", gfcmId: "GFCM001", name: "Site Clearing" },
  { lineItemId: "LI002", gfcmId: "GFCM001", name: "Soil Excavation" },
  { lineItemId: "LI003", gfcmId: "GFCM002", name: "Foundation Pour" },
  { lineItemId: "LI004", gfcmId: "GFCM003", name: "Steel Beams" },
];

const mockTemplateSummary: TemplateSummary = {
  templateSummaryId: "TS001",
  templateId: "TMPL001",
  wpnId: "WPN001",
  grandTotal: 0,
  name: "Project Alpha - Construction Template",
};

const mockGFCMSummaries: GFCMSummary[] = [
  {
    templateSummaryId: "TMPL001",
    gfcmSummaryId: "SS001",
    gfcmId: "GFCM001",
    total: 0,
  },
  {
    templateSummaryId: "TMPL001",

    gfcmSummaryId: "SS002",
    gfcmId: "GFCM002",
    total: 0,
  },
  {
    templateSummaryId: "TMPL001",
    gfcmSummaryId: "SS003",
    gfcmId: "GFCM003",
    total: 0,
  },
];

const mockLineItemDetails: LineItemDetails[] = [
  {
    lineItemDetailId: "LID001",
    lineItemId: "LI001",
    gfcmSummaryId: "SS001",
    quantity: 0,
    unitPrice: 150.0,
    unit: mockUnits[0],
    total: 0,
  },
  {
    lineItemDetailId: "LID002",
    lineItemId: "LI002",
    gfcmSummaryId: "SS001",
    quantity: 0,
    unitPrice: 200.0,
    unit: mockUnits[2],
    total: 0,
  },
  {
    lineItemDetailId: "LID003",
    lineItemId: "LI003",
    gfcmSummaryId: "SS002",
    quantity: 0,
    unitPrice: 500.0,
    unit: mockUnits[3],
    total: 0,
  },
  {
    lineItemDetailId: "LID004",
    lineItemId: "LI004",
    gfcmSummaryId: "SS003",
    quantity: 0,
    unitPrice: 800.0,
    unit: mockUnits[3],
    total: 0,
  },
];

// In-memory storage for attachments (in a real app, this would be in a database)
const mockAttachments: Attachment[] = [];

interface SaveTemplateCompletionResponse {
  success: boolean;
}

export const templateCompletionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTemplateCompletionData: builder.query<
      TemplateCompletionData | undefined,
      string
    >({
      queryFn: async (
        templateId,
        _api,
        _extraOptions,
        _baseQuery,
      ): Promise<
        QueryReturnValue<
          TemplateCompletionData,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >
      > => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const template = mockTemplates.find(t => t.templateId === templateId);

        if (!template) {
          return {
            error: {
              status: 404,
              data: { message: "Template not found" }, // mock error structure
            },
          };
        }

        const data: TemplateCompletionData = {
          template,
          templateSummary: mockTemplateSummary,
          lineItems: mockLineItems,
          gfcms: mockGFCMs,
          wpns: mockWPNs,
          gfcmSummaries: mockGFCMSummaries,
          lineItemDetails: mockLineItemDetails,
          attachments: mockAttachments.filter(
            att =>
              att.templateSummaryId === mockTemplateSummary.templateSummaryId,
          ),
          units: mockUnits,
        };

        return { data };
      },
      providesTags: ["TemplateCompletion", "Attachment"],
    }),

    updateTemplateSummary: builder.mutation<
      TemplateSummary,
      Partial<TemplateSummary> & { templateSummaryId: string }
    >({
      queryFn: async updates => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedSummary = { ...mockTemplateSummary, ...updates };
        return { data: updatedSummary };
      },
      invalidatesTags: ["TemplateCompletion"],
    }),

    updateLineItemDetails: builder.mutation<
      LineItemDetails[],
      LineItemDetails[]
    >({
      queryFn: async lineItemDetails => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: lineItemDetails };
      },
      invalidatesTags: ["TemplateCompletion"],
    }),

    saveTemplateCompletion: builder.mutation<
      SaveTemplateCompletionResponse,
      TemplateCompletionData
    >({
      queryFn: async data => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Saving template completion data:", data);
        return { data: { success: true } };
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
