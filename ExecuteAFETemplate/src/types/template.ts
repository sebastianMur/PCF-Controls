export interface LineItem {
  lineItemId: string;
  gfcmId: string;
  name: string;
}
export interface D365LineItem {
  "@odata.etag": string;
  new_name: string;
  new_lineitemid: string;
  _new_gfcmid_value: string;
}
export interface GFCM {
  GFCMID: string;
  name: string;
  templateId: string;
  gfcmCode: string;
}
export interface D365GFCM {
  "@odata.etag": string;
  new_gfcmid: string;
  _new_templateid_value: string;
  new_gfcmcode: string;
  new_name: string;
}

export interface Unit {
  key: number;
  value: string;
}

export interface LineItemDetails {
  lineItemDetailId: string;
  lineItemId: string;
  gfcmSummaryId: string;
  quantity: number;
  unitPrice: number;
  unit: number;
  total: number;
}
export interface D365LineItemDetails {
  new_lineitemdetailid: string;
  _new_lineitem_value: string;
  _new_gfcmsummaryid_value: string;
  new_quantity: number;
  new_unitprice: number;
  new_unit: number;
  new_total: number;
}

export interface GFCMSummary {
  gfcmSummaryId: string;
  templateSummaryId: string;
  gfcmId: string;
  total: 0;
}

export interface D365GFCMSummary {
  new_gfcmsummaryid: string;
  _new_gfcmid_value: string;
  _new_templatesummaryid_value: string;
  new_total: 0;
}

export interface TemplateSummary {
  templateSummaryId: string;
  templateId: string;
  grandTotal: number;
  name: string;
}
export interface D365TemplateSummary {
  new_templatesummaryid: string;
  new_name: string;
  _new_templateid_value: string;
  new_grandtotal: number;
}

export interface Template {
  templateId: string;
  name: string;
}

export interface D365Template {
  "@odata.context": string;
  "@odata.etag": string;
  new_name: string;
  new_templateid: string;
}

export interface WPN {
  wpnId: string;
  name: string;
}

export interface Attachment {
  attachmentId: string;
  templateSummaryId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  fileUrl: string;
}

// export interface D365Attachment {
//   annotationid: string;
//   notetext:
// }

// Template completion data structure
export interface TemplateCompletionData {
  template: Template;
  templateSummary: TemplateSummary;
  gfcms: GFCM[];
  gfcmSummaries: GFCMSummary[];
  lineItems: LineItem[];
  lineItemDetails: LineItemDetails[];
  attachments: Attachment[];
  units: Unit[];
}

// Helper functions for relational queries
export const getGFCMByTemplate = (
  gfcms: GFCM[],
  templateId: string,
): GFCM[] => {
  return gfcms.filter(gfcm => gfcm.templateId === templateId);
};

export const getLineItemsByGFCM = (
  lineItems: LineItem[],
  gfcmId: string,
): LineItem[] => {
  return lineItems.filter(item => item.gfcmId === gfcmId);
};

export const getGFCMsByTemplateSummary = (
  gfcmSummaries: GFCMSummary[],
  templateSummaryId: string,
): GFCMSummary[] => {
  return gfcmSummaries.filter(cs => cs.templateSummaryId === templateSummaryId);
};

export const getLineItemDetailsByGFCMSummary = (
  lineItemDetails: LineItemDetails[],
  gfcmSummaryId: string,
): LineItemDetails[] => {
  return lineItemDetails.filter(lid => lid.gfcmSummaryId === gfcmSummaryId);
};

export const getAttachmentsByTemplateSummary = (
  attachments: Attachment[],
  templateSummaryId: string,
): Attachment[] => {
  return attachments.filter(att => att.templateSummaryId === templateSummaryId);
};

// Default export
export default {
  getGFCMsByTemplateSummary,
  getLineItemDetailsByGFCMSummary,
  getAttachmentsByTemplateSummary,
  getLineItemsByGFCM,
  getGFCMByTemplate,
};
