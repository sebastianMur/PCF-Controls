import { useGetDefaultValues } from "@/forms/form-config";
import type {
  TemplateFormData,
  TemplateSummaryFormData,
} from "@/forms/form-schemas";
import { useAppSelector } from "@/hooks";
import { toApiTemplateSummary } from "@/mappers/template-mapper";
import { useUpdateTemplateSummaryMutation } from "@/services/templateSummary";
import { selectTemplateId, selectTemplateSummaryId } from "@/store";
import {
  useGetTemplateCompletionDataQuery,
  useSaveTemplateCompletionMutation,
  useSendToAFEExecuteMutation,
} from "@/store/template-completion-api";
import { useTemplateCompletionContainerStyles } from "@/styles/template-completion-container";
import type { TemplateCompletionData, Unit } from "@/types/template";
import {
  updateLineItemQuantity,
  updateLineItemUnit,
  updateLineItemUnitPrice,
} from "@/utils/calculations";
import { STATUS_REASON } from "@/utils/constants";
import { triggerNotifyOutputChange } from "@/utils/notifyOutputChange";
import { MessageBar, Spinner } from "@fluentui/react-components";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { TemplateCompletionForm } from "./template-completion-form";

export default function TemplateCompletionContainer() {
  const styles = useTemplateCompletionContainerStyles();
  const templateId = useAppSelector(selectTemplateId);
  const templateSummaryId = useAppSelector(selectTemplateSummaryId);
  const [hasChanges, setHasChanges] = useState<boolean>(
    () => !templateSummaryId,
  );
  const [localData, setLocalData] = useState<TemplateCompletionData | null>(
    null,
  );

  const {
    data: templateData,
    error,
    isLoading,
  } = useGetTemplateCompletionDataQuery({ templateId }, { skip: !templateId });

  const [saveTemplateCompletion, { isLoading: isSaving }] =
    useSaveTemplateCompletionMutation();
  const [updateTemplateSummary] = useUpdateTemplateSummaryMutation();

  const [sendToAFEExecute, { isLoading: isSending }] =
    useSendToAFEExecuteMutation();

  const { getInitialTemplateValues } = useGetDefaultValues();

  const { control, setValue, getValues, reset } =
    useFormContext<TemplateFormData>();

  const templateSummaryData = useWatch({ control }) as TemplateFormData;
  const isLocked =
    templateSummaryData.templateSummary?.statuscode === STATUS_REASON.Sent;

  const handleQuantityChange = (
    lineItemDetailId: string,
    newQuantity: number,
  ): void => {
    if (isLocked) return;
    const data = getValues();
    const updatedData = updateLineItemQuantity(
      data,
      lineItemDetailId,
      newQuantity,
    );
    for (const [key, value] of Object.entries(updatedData)) {
      setValue(key as unknown as keyof TemplateFormData, value);
    }
    setHasChanges(true);
  };

  const handleUnitPriceChange = (
    lineItemDetailId: string,
    newUnitPrice: number,
  ): void => {
    if (isLocked) return;
    const data = getValues();
    const updatedData = updateLineItemUnitPrice(
      data,
      lineItemDetailId,
      newUnitPrice,
    );

    for (const [key, value] of Object.entries(updatedData)) {
      setValue(key as unknown as keyof TemplateFormData, value);
    }

    setHasChanges(true);
  };

  const handleUnitChange = (lineItemDetailId: string, newUnit: Unit): void => {
    if (isLocked) return;
    const data = getValues();

    const updatedData = updateLineItemUnit(data, lineItemDetailId, newUnit);

    for (const [key, value] of Object.entries(updatedData)) {
      setValue(key as unknown as keyof TemplateFormData, value);
    }
    setHasChanges(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
      const data = getValues();
      await saveTemplateCompletion(data).unwrap();
      triggerNotifyOutputChange();
      const newTemplateFormValues = await getInitialTemplateValues();
      reset(newTemplateFormValues);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save template completion:", error);
    }
  };

  const handleSendingAFEExecute = async (): Promise<void> => {
    try {
      const data = getValues();
      const wpnId = data.templateSummary?.xomuog_wpnid;
      if (wpnId) await sendToAFEExecute(wpnId).unwrap();

      await updateTemplateSummary({
        record: toApiTemplateSummary({
          ...data.templateSummary,
          statuscode: STATUS_REASON.Sent,
        } as TemplateSummaryFormData),
        templateSummaryId,
      }).unwrap();
    } catch (error) {
      console.error("Failed to save template completion:", error);
    }
  };

  // Initialize local data when API data is loaded
  if (templateData && !localData) {
    setLocalData(templateData);
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Loading template completion data..." />
      </div>
    );
  }

  console.log("data", templateData);
  if (error) {
    return (
      <MessageBar intent="error">
        Failed to load template completion data. Please try again.
      </MessageBar>
    );
  }

  if (!localData) {
    return (
      <MessageBar intent="warning">No template data available.</MessageBar>
    );
  }

  return (
    <div className={styles.container}>
      <TemplateCompletionForm
        handleQuantityChange={handleQuantityChange}
        handleSave={handleSave}
        handleUnitChange={handleUnitChange}
        handleUnitPriceChange={handleUnitPriceChange}
        handleSendingAFEExecute={handleSendingAFEExecute}
        isSending={isSending}
        hasChanges={hasChanges}
        isSaving={isSaving}
        isLocked={isLocked}
        templateSummaryId={templateSummaryId}
        templateData={localData}
        templateSummaryData={templateSummaryData}
      />
    </div>
  );
}
