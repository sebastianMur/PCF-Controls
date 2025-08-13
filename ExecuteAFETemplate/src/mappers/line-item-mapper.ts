import type { LineItemDetailsFormData } from "@/forms/form-schemas";
import type {
  D365LineItem,
  D365LineItemDetails,
  GFCMSummary,
  LineItem,
  LineItemDetails,
  SendLineItemDetails,
} from "@/types/template";
import { v4 as uuidv4 } from "uuid";
export const fromApiLineItem = (record: D365LineItem): LineItem => ({
  xomuog_lineitemid: record.xomuog_lineitemid,
  xomuog_name: record.xomuog_name,
  xomuog_gfcmid: record._xomuog_gfcmid_value,
  xomuog_defaultunit: record.xomuog_defaultunit,
  xomuog_defaultunitprice: record.xomuog_defaultunitprice,
});

export const fromLineItemToLineItemDetails = (
  lineItem: LineItem,
  gfcmSummaries: GFCMSummary[],
): LineItemDetailsFormData => {
  const matchGFCM = gfcmSummaries?.find(
    gfcmSummary => gfcmSummary.xomuog_gfcmid === lineItem.xomuog_gfcmid,
  );

  return {
    xomuog_gfcmsummaryid: matchGFCM?.xomuog_gfcmsummaryid ?? "",
    xomuog_lineitem: lineItem.xomuog_lineitemid,
    xomuog_lineitemdetailid: uuidv4(),
    xomuog_quantity: 1,
    xomuog_total: 0,
    xomuog_unit: lineItem.xomuog_defaultunit,
    xomuog_unitprice: lineItem.xomuog_defaultunitprice,
    xomuog_name: lineItem.xomuog_name,
  };
};

export const fromApiLineItemDetail = (
  record: D365LineItemDetails,
): LineItemDetails => ({
  xomuog_lineitemdetailid: record.xomuog_lineitemdetailid,
  xomuog_lineitem: record._xomuog_lineitem_value,
  xomuog_gfcmsummaryid: record._xomuog_gfcmsummaryid_value,
  xomuog_quantity: record.xomuog_quantity ?? 1,
  xomuog_unitprice: record.xomuog_unitprice ?? 0,
  xomuog_total: record.xomuog_total ?? 0,
  xomuog_unit: record.xomuog_unit,
});
export const fromApiLineItemFormDetail = (
  record: D365LineItemDetails,
): LineItemDetailsFormData => ({
  xomuog_lineitemdetailid: record.xomuog_lineitemdetailid,
  xomuog_lineitem: record._xomuog_lineitem_value ?? "",
  xomuog_gfcmsummaryid: record._xomuog_gfcmsummaryid_value ?? "",
  xomuog_quantity: record.xomuog_quantity ?? 1,
  xomuog_unitprice: record.xomuog_unitprice ?? 0,
  xomuog_total: record.xomuog_total ?? 0,
  xomuog_unit: record.xomuog_unit ?? 0,
  xomuog_name: record.xomuog_name ?? "",
});

export const toApiLineItemFormDetail = (
  record: LineItemDetailsFormData,
): SendLineItemDetails => ({
  "xomuog_gfcmsummaryid@odata.bind": `/xomuog_gfcmsummaries(${record.xomuog_gfcmsummaryid})`,
  "xomuog_lineitem@odata.bind": `/xomuog_lineitems(${record.xomuog_lineitem})`,
  xomuog_quantity: record.xomuog_quantity,
  xomuog_total: record.xomuog_total,
  xomuog_unitprice: record.xomuog_unitprice,
  xomuog_name: record.xomuog_name,
  xomuog_unit: record.xomuog_unit,
});
