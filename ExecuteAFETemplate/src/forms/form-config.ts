import { useAppSelector } from "@/hooks";
import { fromGFCMtoGFCMSummary } from "@/mappers/gfcm-mapper";
import { fromLineItemToLineItemDetails } from "@/mappers/line-item-mapper";
import { fromTemplateToTemplateSummary } from "@/mappers/template-mapper";
import { useLazyGetGFCMsQuery } from "@/services/gfcm";
import { useLazyGetGFCMSummarysQuery } from "@/services/gfcm-summary";
import { useLazyGetLineItemsDetailsQuery } from "@/services/line-item-detail";
import { useLazyGetLineItemQuery } from "@/services/line-items";
import { useLazyGetNotesQuery } from "@/services/notes";
import { useLazyGetTemplateQuery } from "@/services/template";
import { useLazyGetTemplateSummaryQuery } from "@/services/templateSummary";
import { useLazyGetWPNQuery } from "@/services/wpn";
import {
  selectTemplateId,
  selectTemplateSummaryId,
  selectWPNId,
} from "@/store";
import { recalculateAllTotals } from "@/utils/calculations";
import { getTemplateSummaryRequiredFields } from "@/utils/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type TemplateFormData, templateFormSchema } from "./form-schemas";

export const useGetDefaultValues = () => {
  //* ───── RTK Query ─────
  const templateId = useAppSelector(selectTemplateId);
  const templateSummaryId = useAppSelector(selectTemplateSummaryId);
  const wpnId = useAppSelector(selectWPNId);

  const [getWPN] = useLazyGetWPNQuery();

  const [getAttachments] = useLazyGetNotesQuery();
  // get template summary with template information
  const [getTemplateFormData] = useLazyGetTemplateQuery();
  const [getTemplateSummaryFormData] = useLazyGetTemplateSummaryQuery();

  const [getGFCMs] = useLazyGetGFCMsQuery();
  const [getGFCMsSummary] = useLazyGetGFCMSummarysQuery();

  const [getLineItems] = useLazyGetLineItemQuery();
  const [getLineItemsDetails] = useLazyGetLineItemsDetailsQuery();

  const saveExistingTemplateSummary = useCallback(
    async tempSummaryId => {
      if (tempSummaryId) {
        const [templateSummary, gfcmSummaries, lineItemDetails, attachments] =
          await Promise.all([
            getTemplateSummaryFormData(templateSummaryId).unwrap(),
            getGFCMsSummary(templateSummaryId).unwrap(),
            getLineItemsDetails(templateSummaryId).unwrap(),
            getAttachments(templateSummaryId).unwrap(),
          ]);

        const requiredFieldsMessages = getTemplateSummaryRequiredFields(
          templateSummary,
          attachments.length > 0,
        );

        const d365DefaultValues = {
          templateSummary: templateSummary,
          gfcmSummary: gfcmSummaries,
          lineItemsDetails: lineItemDetails,
          isNew: false,
          requiredFieldsMessages,
        };

        return recalculateAllTotals(d365DefaultValues);
      }
      return undefined;
    },
    [
      getGFCMsSummary,
      getLineItemsDetails,
      getTemplateSummaryFormData,
      templateSummaryId,
      getAttachments,
    ],
  );

  const createNewTemplateSummary = useCallback(async () => {
    const [template, lineItems, gfcms] = await Promise.all([
      getTemplateFormData(templateId).unwrap(),
      getLineItems(templateId).unwrap(),
      getGFCMs(templateId).unwrap(),
    ]);
    const wpn = await getWPN(wpnId).unwrap();

    const templateSummary = fromTemplateToTemplateSummary(template, wpn);
    const gfcmSummaries = gfcms.map(gfcm =>
      fromGFCMtoGFCMSummary(gfcm, templateSummary.xomuog_templatesummaryid),
    );
    const lineItemDetails = lineItems.map(lineItem =>
      fromLineItemToLineItemDetails(lineItem, gfcmSummaries),
    );

    const d365DefaultValues = {
      templateSummary,
      gfcmSummary: gfcmSummaries,
      lineItemsDetails: lineItemDetails,
      isNew: true,
      requiredFieldsMessages: [""],
      hasAttachments: false,
    };

    return recalculateAllTotals(d365DefaultValues);
  }, [getGFCMs, getLineItems, getTemplateFormData, templateId, wpnId, getWPN]);

  const getInitialTemplateValues =
    useCallback(async (): Promise<TemplateFormData> => {
      // Provide an initial object with safe defaults
      const defaultValues: TemplateFormData = {
        templateSummary: undefined,
        gfcmSummary: [],
        lineItemsDetails: [],
        isNew: false,
        requiredFieldsMessages: [],
      };
      if (!templateId) return defaultValues;

      try {
        // ** Save Existing Template Summary **

        const defaultValuesForAFECreation =
          await saveExistingTemplateSummary(templateSummaryId);
        if (
          defaultValuesForAFECreation?.templateSummary?.xomuog_templatesummaryid
        )
          return defaultValuesForAFECreation;

        // ** Create new Template Summary **
        const createdTemplateSummary = await createNewTemplateSummary();
        return createdTemplateSummary;
      } catch (error) {
        // Handle or log errors as needed
        console.error("Failed to load initial template values", error);
        return defaultValues;
      }
    }, [
      templateId,
      createNewTemplateSummary,
      saveExistingTemplateSummary,
      templateSummaryId,
    ]);

  return {
    getInitialTemplateValues,
    saveExistingTemplateSummary,
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
