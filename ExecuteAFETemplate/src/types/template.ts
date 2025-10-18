import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface LineItem {
  xomuog_lineitemid: string;
  xomuog_name: string;
  xomuog_gfcmid: string;
  xomuog_defaultunitprice: number;
  xomuog_defaultunit: number;
}
export interface D365LineItem {
  "@odata.etag": string;
  xomuog_lineitemid: string;
  xomuog_name: string;
  xomuog_defaultunit: number;
  xomuog_defaultunitprice: number;
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
export type D365GlobalOptionset = {
  Value: 529510000;
  Color: null;
  IsManaged: false;
  ExternalValue: "";
  ParentValues: [];
  Tag: null;
  IsHidden: false;
  MetadataId: null;
  HasChanged: null;
  Label: {
    LocalizedLabels: [
      {
        Label: "Per Day";
        LanguageCode: 1033;
        IsManaged: false;
        MetadataId: "8603ac38-96bc-417d-b7e7-9e679e038981";
        HasChanged: null;
      },
    ];
    UserLocalizedLabel: {
      Label: "Per Day";
      LanguageCode: 1033;
      IsManaged: false;
      MetadataId: "8603ac38-96bc-417d-b7e7-9e679e038981";
      HasChanged: null;
    };
  };
  Description: {
    LocalizedLabels: [
      {
        Label: "";
        LanguageCode: 1033;
        IsManaged: false;
        MetadataId: "0702ebfa-7fd7-4dd0-9496-83f2a8f11f31";
        HasChanged: null;
      },
    ];
    UserLocalizedLabel: {
      Label: "";
      LanguageCode: 1033;
      IsManaged: false;
      MetadataId: "0702ebfa-7fd7-4dd0-9496-83f2a8f11f31";
      HasChanged: null;
    };
  };
};

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

export interface SendLineItemDetails {
  "xomuog_gfcmsummaryid@odata.bind": string;
  "xomuog_lineitem@odata.bind": string;
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
  _xomuog_templatesummaryid_value: string;
  _xomuog_gfcmid_value?: string;
  xomuog_name?: string;
  xomuog_total: number;
}

export interface SendGFCMSummary {
  "xomuog_templatesummaryid@odata.bind": string;
  "xomuog_gfcmid@odata.bind"?: string;
  xomuog_name?: string;
  xomuog_total: number;
}

// export interface TemplateSummary {
//   xomuog_templatesummaryid: string;
//   xomuog_capexopex?: number;
//   xomuog_companycode?: string;
//   xomuog_costcenter?: string;
//   xomuog_descriptionscopeofwork?: string;
//   xomuog_engineer?: string;
//   exchangerate?: number;
//   xomuog_grandtotal: number;
//   xomuog_grandtotal_base?: number;
//   xomuog_landman?: string;
//   xomuog_mainprojecttype?: number;
//   xomuog_operatore?: string;
//   xomuog_projectdescription?: string;
//   xomuog_name?: string;
//   xomuog_projectnumber?: string;
//   xomuog_specialinstruction?: string;
//   xomuog_subprojecttype?: string;
//   xomuog_templateid?: string;
//   xomuog_wpnid?: string;
// }
export interface D365TemplateSummary {
  xomuog_templatesummaryid: string;
  xomuog_capexopex?: number;
  xomuog_companycode: string;
  xomuog_costcenter: string;
  xomuog_descriptionscopeofwork: string;
  _xomuog_engineerid_value?: string;
  exchangerate?: number;
  xomuog_grandtotal: number;
  xomuog_grandtotal_base?: number;
  _xomuog_landmanid_value?: string;
  xomuog_mainprojecttype?: number;
  _xomuog_operator_value?: string;
  xomuog_projectdescription?: string;
  xomuog_name?: string;
  xomuog_projectnumber?: string;
  xomuog_specialinstruction?: string;
  xomuog_subprojecttype?: string;
  _xomuog_templateid_value?: string;
  _xomuog_wpnid_value?: string;
  statuscode: number;
  xomuog_afeexecutebusinessunit: number;
  _xomuog_projectteam_value: string;
  xomuog_afedocumentid: string;
  xomuog_aferecordurl: string;
  xomuog_isfilereplaced?: boolean;
}

export interface SendTemplateSummary {
  xomuog_capexopex?: number;
  xomuog_projectdescription: string;
  xomuog_mainprojecttype?: number;
  xomuog_subprojecttype: string;
  "xomuog_engineerid@odata.bind": string | null;
  "xomuog_landmanid@odata.bind": string | null;
  "xomuog_operator@odata.bind": string | null;
  xomuog_descriptionscopeofwork: string;
  xomuog_companycode: string;
  xomuog_costcenter: string;
  xomuog_grandtotal: number;
  xomuog_projectnumber?: string;
  "xomuog_templateid@odata.bind": string;
  statuscode: number;
  "xomuog_wpnid@odata.bind": string;
}

export interface Template {
  xomuog_templateid: string;
  xomuog_name: string;
  xomuog_templatename: string;
  xomuog_type: number;
}
export interface D365Template {
  "@odata.etag": 'W/"589803275"';
  xomuog_templateid: string;
  xomuog_name: string;
  xomuog_templatename: string;
  xomuog_type: number;
}
export interface SendTemplate {
  xomuog_name: string;
}
export interface Attachment {
  annotationid: string;
  name: string;
  type: string;
  url: string;
}
export interface D365Attachment {
  annotationid: string;
  documentbody: string;
  filename: string;
  filesize: number;
  isdocument: boolean;
  mimetype: string;
  objecttypecode: string;
  _objectid_value: string;
  notetext: string;
  subject: string;
  "@odata.etag": string;
}
export interface SendAttachment {
  objecttypecode: string;
  mimetype: string;
  "objectid_xomuog_templatesummary@odata.bind": string;
  isdocument: true;
  filename: string;
  subject: string;
  documentbody: string;
}

export type Well = {
  xomuog_sap_costcenter: string;
  xomuog_wellid: string;
};

export interface WPN {
  xomuog_wellproblemnotificationid: string;
  xomuog_primaryjobtypeid: string;
  xomuog_primaryjobtypename: string;
  xomuog_engineerid: string;
  xomuog_landman: string;
  xomuog_secondaryjobtype: string;
  xomuog_secondaryjobtypename: string;
  xomuog_templateid: string;
  xomuog_templatesummaryid: string;
  xomuog_well: string;
  xomuog_wellidname: string;
  xomuog_sap_costcenter: string;
}
export interface D365WPN {
  xomuog_wellproblemnotificationid: string;
  xomuog_primaryjobtype_ee: string;
  "xomuog_primaryjobtype_ee@OData.Community.Display.V1.FormattedValue": string;
  _xomuog_engineerid_value: string;
  "_xomuog_engineerid_value@OData.Community.Display.V1.FormattedValue": string;
  xomuog_secondaryjobtype_ee: string;
  "xomuog_secondaryjobtype_ee@OData.Community.Display.V1.FormattedValue": string;
  _xomuog_templateid_value: string;
  "_xomuog_templateid_value@OData.Community.Display.V1.FormattedValue": string;
  _xomuog_templatesummaryid_value: string;
  "_xomuog_templatesummaryid_value@OData.Community.Display.V1.FormattedValue": string;
  _xomuog_wellid_value: string;
  "_xomuog_wellid_value@OData.Community.Display.V1.FormattedValue": string;
  _xomuog_landman_value: string;
  xomuog_wellid: Well;
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

export interface ODataRawGlobalOptionset<T> {
  Options: T[];
}
export interface ODataGlobalOptionset<T> {
  data?: ODataRawGlobalOptionset<T>;
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

// Default export
export default {
  getGFCMsByTemplateSummary,
  getLineItemDetailsByGFCMSummary,
  getLineItemsByGFCM,
  getGFCMByTemplate,
};

export interface D365Operator {
  xomuog_operatorid: string;
  xomuog_name: string;
  xomuog_number: string;
  statuscode: number;
}

export interface Operator {
  xomuog_operatorid: string;
  xomuog_name: string;
  xomuog_number: string;
  statuscode: number;
}
