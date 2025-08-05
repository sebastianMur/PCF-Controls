import type { TemplateSummaryFormData } from "@/forms/form-schemas";
import type {
  D365Template,
  D365TemplateSummary,
  SendTemplate,
  SendTemplateSummary,
  Template,
  TemplateSummary,
} from "@/types/template";
import { v4 as uuidv4 } from "uuid";

export const fromApiTemplate = (record: D365Template): Template => ({
  xomuog_templateid: record.xomuog_templateid,
  xomuog_name: record.xomuog_name,
});

export const toApiTemplate = (model: Template): SendTemplate => ({
  xomuog_name: model.xomuog_name,
});

export const fromApiTemplateSummary = (
  record: D365TemplateSummary,
): TemplateSummary =>
  ({
    xomuog_templatesummaryid: record.xomuog_templatesummaryid,
    xomuog_name: record.xomuog_name,
    xomuog_templateid: record._xomuog_templateid_value,
    xomuog_grandtotal: record.xomuog_grandtotal ?? 0,
    xomuog_capexopex: record.xomuog_capexopex,
    xomuog_costcenter: record.xomuog_costcenter,
    xomuog_companycode: record.xomuog_companycode,
    xomuog_descriptionscopeofwork: record.xomuog_descriptionscopeofwork,
    xomuog_engineer: record.xomuog_engineer,
    xomuog_landman: record.xomuog_landman,
    xomuog_operator: record._xomuog_operator_value,
    xomuog_projectnumber: record.xomuog_projectnumber,
    xomuog_specialinstruction: record.xomuog_specialinstruction,
    xomuog_subprojecttype: record.xomuog_subprojecttype,
    xomuog_mainprojecttype: record.xomuog_mainprojecttype,
    xomuog_projectdescription: record.xomuog_projectdescription,
    xomuog_wpnid: record._xomuog_wpnid_value,
  }) as TemplateSummary;

export const fromApiTemplateFormSummary = (
  record: D365TemplateSummary,
): TemplateSummaryFormData => ({
  xomuog_templatesummaryid: record.xomuog_templatesummaryid,
  xomuog_name: record.xomuog_name ?? "",
  xomuog_templateid: record._xomuog_templateid_value ?? "",
  xomuog_grandtotal: record.xomuog_grandtotal ?? 0,
  xomuog_wpnid: record._xomuog_wpnid_value ?? "",
});

export const fromTemplateToTemplateSummary = (
  record: Template,
  wpnId: string,
): TemplateSummaryFormData => ({
  xomuog_templatesummaryid: uuidv4(),
  xomuog_name: record.xomuog_name,
  xomuog_templateid: record.xomuog_templateid,
  xomuog_grandtotal: 0,
  xomuog_wpnid: wpnId,
});

export const toApiTemplateSummary = (
  record: TemplateSummaryFormData,
): SendTemplateSummary => ({
  "xomuog_templateid@odata.bind": `/xomuog_templates(${record.xomuog_templateid})`,
  "xomuog_wpnid@odata.bind": `/xomuog_wellproblemnotifications(${record.xomuog_wpnid})`,
  xomuog_grandtotal: record.xomuog_grandtotal,
  xomuog_name: record.xomuog_name,
});

//
// export const fromApiAttachment = (record: any): Attachment => ({
//   id: record.annotationid,
//   name: record.filename,
//   documentBody: record.documentbody,
//   fileSize: record.filesize,
//   mimeType: record.mimetype,
//   note: record.notetext,
// });
