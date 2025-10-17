import type { GFCMSummaryFormData } from "@/forms/form-schemas";
import type {
  D365GFCM,
  D365GFCMSummary,
  GFCM,
  GFCMSummary,
  SendGFCMSummary,
} from "@/types/template";
import { v4 as uuidv4 } from "uuid";
export const fromApiGFCM = (record: D365GFCM): GFCM => ({
  xomuog_gfcmid: record.xomuog_gfcmid,
  xomuog_name: record.xomuog_name,
  xomuog_templateid: record._xomuog_templateid_value,
  xomuog_gfcmcode: record.xomuog_gfcmcode,
});

export const fromApiGFCMSummary = (record: D365GFCMSummary): GFCMSummary => ({
  xomuog_gfcmsummaryid: record.xomuog_gfcmsummaryid,
  xomuog_gfcmid: record._xomuog_gfcmid_value,
  xomuog_templatesummaryid: record._xomuog_templatesummaryid_value,
  xomuog_total: record.xomuog_total,
});
export const fromApiGFCMFormSummary = (
  record: D365GFCMSummary,
): GFCMSummaryFormData => ({
  xomuog_gfcmsummaryid: record.xomuog_gfcmsummaryid,
  xomuog_gfcmid: record._xomuog_gfcmid_value ?? "",
  xomuog_templatesummaryid: record._xomuog_templatesummaryid_value,
  xomuog_total: record.xomuog_total,
  xomuog_name: record.xomuog_name ?? "",
});

export const fromGFCMtoGFCMSummary = (
  gfcm: GFCM,
  templateSummaryId: string,
): GFCMSummaryFormData => ({
  xomuog_gfcmid: gfcm.xomuog_gfcmid,
  xomuog_gfcmsummaryid: uuidv4(),
  xomuog_name: gfcm.xomuog_name ?? "",
  xomuog_templatesummaryid: templateSummaryId,
  xomuog_total: 0,
});
export const toApiGFCMSummary = (
  gfcmSummary: GFCMSummaryFormData,
): SendGFCMSummary => ({
  "xomuog_templatesummaryid@odata.bind": `/xomuog_templatesummaries(${gfcmSummary.xomuog_templatesummaryid})`,
  xomuog_name: gfcmSummary.xomuog_name,
  xomuog_total: gfcmSummary.xomuog_total,
  "xomuog_gfcmid@odata.bind": `/xomuog_gfcms(${gfcmSummary.xomuog_gfcmid})`,
});
