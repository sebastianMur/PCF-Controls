import type { TemplateSummaryFormData } from "@/forms/form-schemas";
import type {
  D365Template,
  D365TemplateSummary,
  SendTemplate,
  SendTemplateSummary,
  Template,
  WPN,
} from "@/types/template";
import {
  CAPEX_OPEX,
  MAIN_PROJECT_TYPE,
  STATUS_REASON,
} from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";

export const fromApiTemplate = (record: D365Template): Template => ({
  xomuog_templateid: record.xomuog_templateid,
  xomuog_name: record.xomuog_name,
});

export const toApiTemplate = (model: Template): SendTemplate => ({
  xomuog_name: model.xomuog_name,
});

export const fromApiTemplateFormSummary = (
  record: D365TemplateSummary,
): TemplateSummaryFormData => ({
  xomuog_templatesummaryid: record.xomuog_templatesummaryid,
  xomuog_projectnumber: record.xomuog_projectnumber ?? "### ## ##",
  xomuog_templateid: record._xomuog_templateid_value ?? "",
  xomuog_grandtotal: record.xomuog_grandtotal ?? 0,
  xomuog_wpnid: record._xomuog_wpnid_value ?? "",
  statuscode: record.statuscode,
  xomuog_capexopex: record.xomuog_capexopex ?? CAPEX_OPEX.Opex,
  xomuog_companycode: record.xomuog_companycode,
  xomuog_costcenter: record.xomuog_costcenter,
  xomuog_descriptionscopeofwork: record.xomuog_descriptionscopeofwork,
  xomuog_mainprojecttype: record.xomuog_mainprojecttype ?? MAIN_PROJECT_TYPE.CW,
  xomuog_projectdescription: record.xomuog_projectdescription ?? "",
  xomuog_subprojecttype: record.xomuog_subprojecttype ?? "",
  xomuog_engineerid: record._xomuog_engineerid_value,
  xomuog_landmanid: record._xomuog_landmanid_value,
  xomuog_operator: "e90b53d3-2778-f011-b4cb-7ced8d1fc3c0",
  xomuog_afeexecutebusinessunit: record.xomuog_afeexecutebusinessunit,
  xomuog_projectteam: record._xomuog_projectteam_value,
});

export const fromTemplateToTemplateSummary = (
  record: Template,
  wpn: WPN,
): TemplateSummaryFormData => ({
  xomuog_templatesummaryid: uuidv4(),
  xomuog_projectnumber: "### ### ###",
  xomuog_templateid: record.xomuog_templateid,
  xomuog_grandtotal: 0,
  xomuog_wpnid: wpn.xomuog_wellproblemnotificationid,
  statuscode: STATUS_REASON.Active,
  xomuog_capexopex:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? CAPEX_OPEX.Opex
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? CAPEX_OPEX.Capex
        : undefined,
  xomuog_companycode: "XTO ENERGY INC RU4331",
  xomuog_costcenter: wpn?.xomuog_sap_costcenter ?? "",
  xomuog_descriptionscopeofwork: `${wpn.xomuog_wellidname ?? ""} ${wpn.xomuog_primaryjobtypename ?? ""} ${wpn.xomuog_secondaryjobtypename ?? ""}`,
  xomuog_mainprojecttype:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? MAIN_PROJECT_TYPE.RW
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? MAIN_PROJECT_TYPE.CW
        : undefined,
  xomuog_projectdescription: `${wpn.xomuog_wellidname ?? ""} ${wpn.xomuog_primaryjobtypename ?? ""} ${wpn.xomuog_secondaryjobtypename ?? ""}`,
  xomuog_subprojecttype:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? "REMEDIAL WORKOVER"
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? "CAPITAL WORKOVER"
        : "",
  xomuog_engineerid: wpn.xomuog_engineerid,
  xomuog_landmanid: wpn.xomuog_landman,
  xomuog_operator: "e90b53d3-2778-f011-b4cb-7ced8d1fc3c0",
});

export const fromTemplateToTemplateSummaryOnSave = (
  record: Template,
  templateSummary: TemplateSummaryFormData,
  wpn: WPN,
): TemplateSummaryFormData => ({
  ...templateSummary,
  xomuog_capexopex:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? CAPEX_OPEX.Opex
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? CAPEX_OPEX.Capex
        : undefined,
  xomuog_companycode: "XTO ENERGY INC RU4331",
  xomuog_costcenter: wpn?.xomuog_sap_costcenter ?? "",
  xomuog_descriptionscopeofwork: `${wpn.xomuog_wellidname ?? ""} ${wpn.xomuog_primaryjobtypename ?? ""} ${wpn.xomuog_secondaryjobtypename ?? ""}`,
  // todo: change for new fields values template type for this
  xomuog_mainprojecttype:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? MAIN_PROJECT_TYPE.RW
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? MAIN_PROJECT_TYPE.CW
        : undefined,
  xomuog_projectdescription: `${wpn.xomuog_wellidname ?? ""} ${wpn.xomuog_primaryjobtypename ?? ""} ${wpn.xomuog_secondaryjobtypename ?? ""}`,
  // todo: change for new fields values template type for this
  xomuog_subprojecttype:
    record.xomuog_name === "RW - DEFAULT TEMPLATE"
      ? "REMEDIAL WORKOVER"
      : record.xomuog_name === "CW - DEFAULT TEMPLATE"
        ? "CAPITAL WORKOVER"
        : "",
  xomuog_engineerid: wpn.xomuog_engineerid,
  xomuog_landmanid: wpn.xomuog_landman,

  // todo: call the operator from templpate summary default values
  xomuog_operator: "e90b53d3-2778-f011-b4cb-7ced8d1fc3c0",
  xomuog_projectteam: templateSummary.xomuog_projectteam || "",
  xomuog_afeexecutebusinessunit:
    templateSummary.xomuog_afeexecutebusinessunit || undefined,
});

export const toApiTemplateSummary = (
  record: TemplateSummaryFormData,
): SendTemplateSummary => ({
  "xomuog_templateid@odata.bind": `/xomuog_templates(${record.xomuog_templateid})`,
  "xomuog_wpnid@odata.bind": `/xomuog_wellproblemnotifications(${record.xomuog_wpnid})`,
  xomuog_grandtotal: record.xomuog_grandtotal,
  xomuog_projectnumber: record.xomuog_projectnumber,
  statuscode: record.statuscode,
  "xomuog_engineerid@odata.bind": record.xomuog_engineerid
    ? `/systemusers(${record.xomuog_engineerid})`
    : null,
  "xomuog_landmanid@odata.bind": record.xomuog_landmanid
    ? `/systemusers(${record.xomuog_landmanid})`
    : null,
  "xomuog_operator@odata.bind": `/xomuog_operators(${record.xomuog_operator})`,
  xomuog_capexopex: record.xomuog_capexopex,
  xomuog_companycode: record.xomuog_companycode,
  xomuog_costcenter: record.xomuog_costcenter,
  xomuog_descriptionscopeofwork: record?.xomuog_descriptionscopeofwork?.trim(),
  xomuog_mainprojecttype: record.xomuog_mainprojecttype,
  xomuog_projectdescription: record?.xomuog_projectdescription?.trim(),
  xomuog_subprojecttype: record.xomuog_subprojecttype,
});
