import type {
  GFCMSummaryFormData,
  LineItemDetailsFormData,
  TemplateFormData,
  TemplateSummaryFormData,
} from "@/forms/form-schemas";
import type { GFCMSummary, LineItemDetails, Unit } from "../types/template";
import { getLineItemDetailsByGFCMSummary } from "../types/template";

export const calculateLineItemTotal = (
  quantity: number,
  unitPrice: number,
): number => {
  return quantity * unitPrice;
};

export const calculateGFCMSummaryTotal = (
  lineItemDetails: LineItemDetails[],
  gfcmSummaryId: string,
): number => {
  const relatedLineItems = getLineItemDetailsByGFCMSummary(
    lineItemDetails,
    gfcmSummaryId,
  );
  return relatedLineItems.reduce((sum, item) => sum + item.xomuog_total, 0);
};

export const calculateGrandTotal = (gfcmSummaries: GFCMSummary[]): number => {
  return gfcmSummaries.reduce((sum, cat) => sum + cat.xomuog_total, 0);
};

export const recalculateAllTotals = (
  data: TemplateFormData,
): TemplateFormData => {
  // Step 1: Calculate line item totals
  const updatedLineItemDetails = data.lineItemsDetails?.map(item => ({
    ...item,
    xomuog_total: calculateLineItemTotal(
      item.xomuog_quantity,
      item.xomuog_unitprice,
    ),
  })) as LineItemDetailsFormData[];

  // Step 2: Calculate GFCM summary totals
  const updatedGFCMSummaries = data.gfcmSummary?.map(sub => ({
    ...sub,
    xomuog_total: calculateGFCMSummaryTotal(
      updatedLineItemDetails,
      sub.xomuog_gfcmsummaryid,
    ),
  })) as GFCMSummaryFormData[];

  // Step 4: Calculate grand total
  const grandTotal = calculateGrandTotal(updatedGFCMSummaries);
  const updatedTemplateSummary = {
    ...data.templateSummary,
    xomuog_grandtotal: grandTotal,
  } as TemplateSummaryFormData;

  return {
    ...data,
    lineItemsDetails: updatedLineItemDetails,
    gfcmSummary: updatedGFCMSummaries,
    templateSummary: updatedTemplateSummary,
  };
};

export const adjustUnitPricesProportionally = (
  data: TemplateFormData,
  newGrandTotal: number,
): TemplateFormData => {
  const currentGrandTotal = data.templateSummary?.xomuog_grandtotal ?? 0;

  if (currentGrandTotal === 0 || newGrandTotal === currentGrandTotal) {
    return data;
  }

  const adjustmentRatio = newGrandTotal / currentGrandTotal;

  // Adjust unit prices proportionally
  const adjustedLineItemDetails = data.lineItemsDetails?.map(item => ({
    ...item,
    xomuog_unitprice:
      Math.round(item.xomuog_unitprice * adjustmentRatio * 100) / 100, // Round to 2 decimal places
    xomuog_total: calculateLineItemTotal(
      item.xomuog_quantity,
      item.xomuog_unitprice * adjustmentRatio,
    ),
  }));

  // Recalculate all totals with adjusted prices
  return recalculateAllTotals({
    ...data,
    lineItemsDetails: adjustedLineItemDetails,
    templateSummary: {
      ...data.templateSummary,
      xomuog_grandtotal: newGrandTotal,
    } as TemplateSummaryFormData,
  });
};

export const updateLineItemQuantity = (
  data: TemplateFormData,
  lineItemDetailId: string,
  newQuantity: number,
): TemplateFormData => {
  const updatedLineItemDetails = data?.lineItemsDetails?.map(item =>
    item.xomuog_lineitemdetailid === lineItemDetailId
      ? {
          ...item,
          xomuog_quantity: newQuantity,
          xomuog_total: calculateLineItemTotal(
            newQuantity,
            item.xomuog_unitprice,
          ),
        }
      : item,
  );

  return recalculateAllTotals({
    ...data,
    lineItemsDetails: updatedLineItemDetails,
  });
};

export const updateLineItemUnitPrice = (
  data: TemplateFormData,
  lineItemDetailId: string,
  newUnitPrice: number,
): TemplateFormData => {
  const updatedLineItemDetails = data.lineItemsDetails?.map(item =>
    item.xomuog_lineitemdetailid === lineItemDetailId
      ? {
          ...item,
          xomuog_unitprice: newUnitPrice,
          xomuog_total: calculateLineItemTotal(
            item.xomuog_quantity,
            newUnitPrice,
          ),
        }
      : item,
  );

  return recalculateAllTotals({
    ...data,
    lineItemsDetails: updatedLineItemDetails,
  });
};

export const updateLineItemUnit = (
  data: TemplateFormData,
  lineItemDetailId: string,
  newUnit: Unit,
): TemplateFormData => {
  const updatedLineItemDetails = data.lineItemsDetails?.map(item =>
    item.xomuog_lineitemdetailid === lineItemDetailId
      ? {
          ...item,
          unit: newUnit.key,
        }
      : item,
  );

  return {
    ...data,
    lineItemsDetails: updatedLineItemDetails,
  };
};
