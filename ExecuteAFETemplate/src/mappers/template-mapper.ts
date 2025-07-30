import type {
  D365GFCM,
  D365GFCMSummary,
  D365LineItem,
  D365LineItemDetails,
  D365Template,
  D365TemplateSummary,
  GFCM,
  GFCMSummary,
  LineItem,
  LineItemDetails,
  Template,
  TemplateSummary,
} from "../types/template";

//
// 🔄 TEMPLATE
//
export const fromApiTemplate = (record: D365Template): Template => ({
  templateId: record.new_templateid,
  name: record.new_name,
});

export const toApiTemplate = (model: Template) => ({
  new_name: model.name,
});

//
// 🔄 TEMPLATE SUMMARY
//
export const fromApiTemplateSummary = (
  record: D365TemplateSummary,
): TemplateSummary => ({
  templateSummaryId: record.new_templatesummaryid,
  name: record.new_name,
  templateId: record._new_templateid_value,
  grandTotal: record.new_grandtotal ?? 0,
});

//
// 🔄 GFCM
//
export const fromApiGFCM = (record: D365GFCM): GFCM => ({
  GFCMID: record.new_gfcmid,
  name: record.new_name,
  templateId: record._new_templateid_value,
  gfcmCode: record.new_gfcmcode,
});

//
// 🔄 GFCM SUMMARY
//
export const fromApiGFCMSummary = (record: D365GFCMSummary): GFCMSummary => ({
  gfcmSummaryId: record.new_gfcmsummaryid,
  gfcmId: record._new_gfcmid_value,
  templateSummaryId: record._new_templatesummaryid_value,
  total: record.new_total,
});

//
// 🔄 LINE ITEM
//
export const fromApiLineItem = (record: D365LineItem): LineItem => ({
  lineItemId: record.new_lineitemid,
  name: record.new_name,
  gfcmId: record._new_gfcmid_value,
});

//
// 🔄 LINE ITEM DETAIL
//
export const fromApiLineItemDetail = (
  record: D365LineItemDetails,
): LineItemDetails => ({
  lineItemDetailId: record.new_lineitemdetailid,
  lineItemId: record._new_lineitem_value,
  gfcmSummaryId: record._new_gfcmsummaryid_value,
  quantity: record.new_quantity ?? 0,
  unitPrice: record.new_unitprice ?? 0,
  total: record.new_total ?? 0,
  unit: record.new_unit ?? 0,
});

// 🔄 ATTACHMENT
//
// export const fromApiAttachment = (record: any): Attachment => ({
//   id: record.annotationid,
//   name: record.filename,
//   documentBody: record.documentbody,
//   fileSize: record.filesize,
//   mimeType: record.mimetype,
//   note: record.notetext,
// });
