import { useAppSelector } from "@/hooks";
import { fromGFCMtoGFCMSummary } from "@/mappers/gfcm-mapper";
import { fromLineItemToLineItemDetails } from "@/mappers/line-item-mapper";
import { fromTemplateToTemplateSummary } from "@/mappers/template-mapper";
import { useLazyGetGFCMsQuery } from "@/services/gfcm";
import { useLazyGetGFCMSummarysQuery } from "@/services/gfcm-summary";
import { useLazyGetLineItemsDetailsQuery } from "@/services/line-item-detail";
import { useLazyGetLineItemQuery } from "@/services/line-items";
import { useLazyGetTemplateQuery } from "@/services/template";
import { useLazyGetTemplateSummaryQuery } from "@/services/templateSummary";
import {
  selectTemplateId,
  selectTemplateSummaryId,
  selectWPNId,
} from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type TemplateFormData, templateFormSchema } from "./form-schemas";

export const useGetDefaultValues = () => {
  //* ───── RTK Query ─────
  const templateId = useAppSelector(selectTemplateId);
  const templateSummaryId = useAppSelector(selectTemplateSummaryId);
  const wpnId = useAppSelector(selectWPNId);
  // get template summary with template information
  const [getTemplateFormData] = useLazyGetTemplateQuery();
  const [getTemplateSummaryFormData] = useLazyGetTemplateSummaryQuery();

  const [getGFCMs] = useLazyGetGFCMsQuery();
  const [getGFCMsSummary] = useLazyGetGFCMSummarysQuery();

  const [getLineItems] = useLazyGetLineItemQuery();
  const [getLineItemsDetails] = useLazyGetLineItemsDetailsQuery();
  const getInitialTemplateValues =
    useCallback(async (): Promise<TemplateFormData> => {
      // Provide an initial object with safe defaults
      const defaultValues: TemplateFormData = {
        templateSummary: undefined,
        gfcmSummary: [],
        lineItemsDetails: [],
        isNew: false,
      };

      if (!templateId) return defaultValues;

      try {
        const [template, lineItems, gfcms] = await Promise.all([
          getTemplateFormData(templateId).unwrap(),
          getLineItems(templateId).unwrap(),
          getGFCMs(templateId).unwrap(),
        ]);

        if (templateSummaryId) {
          const [templateSummary, gfcmSummaries, lineItemDetails] =
            await Promise.all([
              getTemplateSummaryFormData(templateSummaryId).unwrap(),
              getGFCMsSummary(templateSummaryId).unwrap(),
              getLineItemsDetails(templateSummaryId).unwrap(),
            ]);

          return {
            templateSummary,
            gfcmSummary: gfcmSummaries,
            lineItemsDetails: lineItemDetails,
            isNew: false,
          };
        }

        // If no templateSummaryId, build default values based on template
        const templateSummary = fromTemplateToTemplateSummary(template, wpnId);
        const gfcmSummaries = gfcms.map(gfcm =>
          fromGFCMtoGFCMSummary(gfcm, templateSummary.xomuog_templatesummaryid),
        );
        const lineItemDetails = lineItems.map(lineItem =>
          fromLineItemToLineItemDetails(lineItem, gfcmSummaries),
        );

        return {
          templateSummary,
          gfcmSummary: gfcmSummaries,
          lineItemsDetails: lineItemDetails,
          isNew: true,
        };
      } catch (error) {
        // Handle or log errors as needed
        console.error("Failed to load initial template values", error);
        return defaultValues;
      }
    }, [
      getGFCMs,
      getGFCMsSummary,
      getLineItems,
      getLineItemsDetails,
      getTemplateFormData,
      getTemplateSummaryFormData,
      templateId,
      templateSummaryId,
      wpnId,
    ]);

  return {
    getInitialTemplateValues,
  };
};

export const useTemplateCompletionForm = () => {
  const { getInitialTemplateValues } = useGetDefaultValues();
  const methods = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    shouldUnregister: false, // crucial for multi-step
    mode: "onChange",
    defaultValues: async () => await getInitialTemplateValues(),
  });

  useEffect(() => {
    (async () => {
      const defaultValues = await getInitialTemplateValues();
      methods.reset(defaultValues);
    })();
  }, [getInitialTemplateValues, methods.reset]);

  return methods;
};
