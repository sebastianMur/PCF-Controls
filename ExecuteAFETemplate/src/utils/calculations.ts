import type {
  GFCMSummary,
  LineItemDetails,
  TemplateCompletionData,
  Unit,
} from "../types/template";
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
  return relatedLineItems.reduce((sum, item) => sum + item.total, 0);
};

export const calculateGrandTotal = (gfcmSummaries: GFCMSummary[]): number => {
  return gfcmSummaries.reduce((sum, cat) => sum + cat.total, 0);
};

export const recalculateAllTotals = (
  data: TemplateCompletionData,
): TemplateCompletionData => {
  // Step 1: Calculate line item totals
  const updatedLineItemDetails = data.lineItemDetails.map(item => ({
    ...item,
    total: calculateLineItemTotal(item.quantity, item.unitPrice),
  }));

  // Step 2: Calculate GFCM summary totals
  const updatedGFCMSummaries = data.gfcmSummaries.map(sub => ({
    ...sub,
    total: calculateGFCMSummaryTotal(updatedLineItemDetails, sub.gfcmSummaryId),
  })) as GFCMSummary[];

  // Step 4: Calculate grand total
  const grandTotal = calculateGrandTotal(updatedGFCMSummaries);
  const updatedTemplateSummary = {
    ...data.templateSummary,
    grandTotal,
  };

  return {
    ...data,
    lineItemDetails: updatedLineItemDetails,
    gfcmSummaries: updatedGFCMSummaries,
    templateSummary: updatedTemplateSummary,
  };
};

export const adjustUnitPricesProportionally = (
  data: TemplateCompletionData,
  newGrandTotal: number,
): TemplateCompletionData => {
  const currentGrandTotal = data.templateSummary?.grandTotal;

  if (currentGrandTotal === 0 || newGrandTotal === currentGrandTotal) {
    return data;
  }

  const adjustmentRatio = newGrandTotal / currentGrandTotal;

  // Adjust unit prices proportionally
  const adjustedLineItemDetails = data.lineItemDetails.map(item => ({
    ...item,
    unitPrice: Math.round(item.unitPrice * adjustmentRatio * 100) / 100, // Round to 2 decimal places
    total: calculateLineItemTotal(
      item.quantity,
      item.unitPrice * adjustmentRatio,
    ),
  }));

  // Recalculate all totals with adjusted prices
  return recalculateAllTotals({
    ...data,
    lineItemDetails: adjustedLineItemDetails,
    templateSummary: {
      ...data.templateSummary,
      grandTotal: newGrandTotal,
    },
  });
};

export const updateLineItemQuantity = (
  data: TemplateCompletionData,
  lineItemDetailId: string,
  newQuantity: number,
): TemplateCompletionData => {
  const updatedLineItemDetails = data.lineItemDetails.map(item =>
    item.lineItemDetailId === lineItemDetailId
      ? {
          ...item,
          quantity: newQuantity,
          total: calculateLineItemTotal(newQuantity, item.unitPrice),
        }
      : item,
  );

  return recalculateAllTotals({
    ...data,
    lineItemDetails: updatedLineItemDetails,
  });
};

export const updateLineItemUnitPrice = (
  data: TemplateCompletionData,
  lineItemDetailId: string,
  newUnitPrice: number,
): TemplateCompletionData => {
  const updatedLineItemDetails = data.lineItemDetails.map(item =>
    item.lineItemDetailId === lineItemDetailId
      ? {
          ...item,
          unitPrice: newUnitPrice,
          total: calculateLineItemTotal(item.quantity, newUnitPrice),
        }
      : item,
  );

  return recalculateAllTotals({
    ...data,
    lineItemDetails: updatedLineItemDetails,
  });
};

export const updateLineItemUnit = (
  data: TemplateCompletionData,
  lineItemDetailId: string,
  newUnit: Unit,
): TemplateCompletionData => {
  const updatedLineItemDetails = data.lineItemDetails.map(item =>
    item.lineItemDetailId === lineItemDetailId
      ? {
          ...item,
          unit: newUnit.key,
        }
      : item,
  );

  return {
    ...data,
    lineItemDetails: updatedLineItemDetails,
  };
};
