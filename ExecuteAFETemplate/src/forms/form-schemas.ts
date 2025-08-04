import { z } from "zod";

export const gfcmSummarySchema = z.object({
  xomuog_gfcmsummaryid: z.string(),
  xomuog_templatesummaryid: z.string(),
  xomuog_gfcmid: z.string(),
  xomuog_name: z.string(),
  xomuog_total: z.number(),
});

export const lineItemSchema = z.object({
  xomuog_lineitemdetailid: z.string(),
  xomuog_gfcmsummaryid: z.string(),
  xomuog_lineitem: z.string(),
  xomuog_name: z.string(),
  xomuog_quantity: z.number(),
  xomuog_total: z.number(),
  xomuog_unit: z.number(),
  xomuog_unitprice: z.number(),
});

export const templateSummarySchema = z.object({
  xomuog_templatesummaryid: z.string(),
  xomuog_templateid: z.string(),
  xomuog_name: z.string(),
  xomuog_grandtotal: z.number(),
});

export const attachmentSummarySchema = z
  .object({
    name: z.string(),
    id: z.string(),
    size: z.number(),
    type: z.string(),
  })
  .optional();

export const templateFormSchema = z.object({
  templateSummary: templateSummarySchema.optional(),
  gfcmSummary: z.array(gfcmSummarySchema).optional(),
  lineItemsDetails: z.array(lineItemSchema).optional(),
  isNew: z.boolean(),
  // attachment: attachmentSummarySchema,
});

export type TemplateSummaryFormData = z.infer<typeof templateSummarySchema>;
export type GFCMSummaryFormData = z.infer<typeof gfcmSummarySchema>;
export type LineItemDetailsFormData = z.infer<typeof lineItemSchema>;
export type AttachmentFormData = z.infer<typeof attachmentSummarySchema>;

export type TemplateFormData = z.infer<typeof templateFormSchema>;
