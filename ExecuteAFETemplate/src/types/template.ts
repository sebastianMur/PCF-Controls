import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface LineItem {
  xomuog_lineitemid: string;
  xomuog_name: string;
  xomuog_gfcmid: string;
}
export interface D365LineItem {
  "@odata.etag": string;
  xomuog_lineitemid: string;
  xomuog_name: string;
  _xomuog_gfcmid_value: string;
}
export interface GFCM {
  xomuog_gfcmcode: string;
  xomuog_name: string | null;
  xomuog_templateid: string;
  xomuog_gfcmid: string;
}
export interface D365GFCM {
  "@odata.etag": string;
  xomuog_gfcmcode: string;
  xomuog_name: string | null;
  _xomuog_templateid_value: string;
  xomuog_gfcmid: string;
}

export interface Unit {
  key: number;
  value: string;
}

export interface LineItemDetails {
  xomuog_lineitemdetailid: string;
  xomuog_gfcmsummaryid?: string;
  xomuog_lineitem?: string;
  xomuog_name?: string;
  xomuog_quantity: number;
  xomuog_total: number;
  xomuog_unit?: number;
  xomuog_unitprice: number;
}
export interface D365LineItemDetails {
  xomuog_lineitemdetailid: string;
  _xomuog_gfcmsummaryid_value?: string;
  _xomuog_lineitem_value?: string;
  xomuog_name?: string;
  xomuog_quantity: number;
  xomuog_total: number;
  xomuog_unit?: number;
  xomuog_unitprice: number;
}

export interface GFCMSummary {
  xomuog_gfcmsummaryid: string;
  xomuog_templatesummaryid: string;
  xomuog_gfcmid?: string;
  xomuog_name?: string;
  xomuog_total: number;
}

export interface D365GFCMSummary {
  xomuog_gfcmsummaryid: string;
  _xomuog_xomuog_templatesummaryid_value: string;
  _xomuog_gfcmid_value?: string;
  xomuog_name?: string;
  xomuog_total: number;
}

export interface TemplateSummary {
  xomuog_templatesummaryid: string;
  xomuog_capexopex?: string;
  xomuog_companycode?: string;
  xomuog_costcenter?: string;
  xomuog_descriptionscopeofwork?: string;
  xomuog_engineer?: string;
  exchangerate?: number;
  xomuog_grandtotal: number;
  xomuog_grandtotal_base?: number;
  xomuog_landman?: string;
  xomuog_mainprojecttype?: string;
  xomuog_operatore?: string;
  xomuog_projectdescription?: string;
  xomuog_name?: string;
  xomuog_projectnumber?: string;
  xomuog_specialinstruction?: string;
  xomuog_subprojecttype?: string;
  xomuog_templateid?: string;
  xomuog_wpnid?: string;
}
export interface D365TemplateSummary {
  xomuog_templatesummaryid: string;
  xomuog_capexopex?: string;
  xomuog_companycode?: string;
  xomuog_costcenter?: string;
  xomuog_descriptionscopeofwork?: string;
  xomuog_engineer?: string;
  exchangerate?: number;
  xomuog_grandtotal: number;
  xomuog_grandtotal_base?: number;
  xomuog_landman?: string;
  xomuog_mainprojecttype?: string;
  _xomuog_operator_value?: string;
  xomuog_projectdescription?: string;
  xomuog_name?: string;
  xomuog_projectnumber?: string;
  xomuog_specialinstruction?: string;
  xomuog_subprojecttype?: string;
  _xomuog_templateid_value?: string;
  _xomuog_wpnid_value?: string;
}

export interface Template {
  xomuog_templateid: string;
  xomuog_name: string;
}
export interface D365Template {
  "@odata.etag": 'W/"589803275"';
  xomuog_templateid: string;
  xomuog_name: string;
}
export interface SendTemplate {
  xomuog_name: string;
}
export interface Attachment {
  annotationid: string;
  objectid?: string;
  filename?: string;
  filesize?: number;
  mimetype?: string;
  createdon: string;
  documentbody?: string;
}
export interface D365Attachment {
  "@odata.etag": 'W/"589803275"';
  annotationid: string;
  _objectid_value?: string;
  filename?: string;
  filesize?: number;
  mimetype?: string;
  createdon: string;
  documentbody?: string;
}

export interface WPN {
  wpnId: string;
  name: string;
}

export interface ODataRawResult<T> {
  value: T[];
}

export interface ODataMultipleResponse<T> {
  data?: ODataRawResult<T>;
  error?: FetchBaseQueryError;
}

export interface ODataEntityResponse<T> {
  data?: T;
  error?: FetchBaseQueryError;
}

// Template completion data structure
export interface TemplateCompletionData {
  template: Template;
  gfcms: GFCM[];
  lineItems: LineItem[];
  units: Unit[];
}

// Helper functions for relational queries
export const getGFCMByTemplate = (
  gfcms: GFCM[],
  templateId: string,
): GFCM[] => {
  return gfcms.filter(gfcm => gfcm.xomuog_templateid === templateId);
};

export const getLineItemsByGFCM = (
  lineItems: LineItem[],
  gfcmId: string,
): LineItem[] => {
  return lineItems.filter(item => item.xomuog_gfcmid === gfcmId);
};

export const getGFCMsByTemplateSummary = (
  gfcmSummaries: GFCMSummary[],
  templateSummaryId: string,
): GFCMSummary[] => {
  return gfcmSummaries.filter(
    cs => cs.xomuog_templatesummaryid === templateSummaryId,
  );
};

export const getLineItemDetailsByGFCMSummary = (
  lineItemDetails: LineItemDetails[],
  gfcmSummaryId: string,
): LineItemDetails[] => {
  return lineItemDetails.filter(
    lid => lid.xomuog_gfcmsummaryid === gfcmSummaryId,
  );
};

export const getAttachmentsByTemplateSummary = (
  attachments: Attachment[],
  templateSummaryId: string,
): Attachment[] => {
  return attachments.filter(att => att.objectid === templateSummaryId);
};

// Default export
export default {
  getGFCMsByTemplateSummary,
  getLineItemDetailsByGFCMSummary,
  getAttachmentsByTemplateSummary,
  getLineItemsByGFCM,
  getGFCMByTemplate,
};
