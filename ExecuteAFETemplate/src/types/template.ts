export interface LineItem {
  lineItemId: string;
  gfcmId: string;
  name: string;
}

export interface GFCM {
  GFCMID: string;
  name: string;
  templateId: string;
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
  unit: Unit;
  total: number;
}

export interface GFCMSummary {
  gfcmSummaryId: string;
  templateSummaryId: string;
  gfcmId: string;
  total: 0;
}

export interface TemplateSummary {
  templateSummaryId: string;
  templateId: string;
  wpnId: string;
  grandTotal: number;
  name: string;
}

export interface Template {
  templateId: string;
  name: string;
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

// Template completion data structure
export interface TemplateCompletionData {
  wpns: WPN[];
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
