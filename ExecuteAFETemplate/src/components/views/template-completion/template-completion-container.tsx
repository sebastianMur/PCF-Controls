import type { TemplateFormData } from "@/forms/form-schemas";
import { useAppSelector } from "@/hooks";
import { selectTemplateId } from "@/store";
import {
  useGetTemplateCompletionDataQuery,
  useSaveTemplateCompletionMutation,
} from "@/store/template-completion-api";
import { useTemplateCompletionContainerStyles } from "@/styles/template-completion-container";
import type { TemplateCompletionData, Unit } from "@/types/template";
import {
  updateLineItemQuantity,
  updateLineItemUnit,
  updateLineItemUnitPrice,
} from "@/utils/calculations";
import { MessageBar, Spinner } from "@fluentui/react-components";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { TemplateCompletionForm } from "./template-completion-form";

export default function TemplateCompletionContainer() {
  const templateId = useAppSelector(selectTemplateId);
  const styles = useTemplateCompletionContainerStyles();
  const [isLocked, setIsLocked] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localData, setLocalData] = useState<TemplateCompletionData | null>(
    null,
  );
  const [saveTemplateCompletion, { isLoading: isSaving }] =
    useSaveTemplateCompletionMutation();

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<TemplateFormData>();

  const templateSummaryData = useWatch({ control }) as TemplateFormData;

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
    setValue(
      "templateSummary.xomuog_grandtotal",
      updatedData.templateSummary?.xomuog_grandtotal ?? 0,
    );
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
      setHasChanges(false);
      setIsLocked(true);
    } catch (error) {
      console.error("Failed to save template completion:", error);
    }
  };

  const handleUnlock = (): void => {
    setIsLocked(false);
  };

  const {
    data: templateData,
    error,
    isLoading,
  } = useGetTemplateCompletionDataQuery({ templateId });

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
        errors={errors}
        handleQuantityChange={handleQuantityChange}
        handleSave={handleSave}
        handleUnitChange={handleUnitChange}
        handleUnitPriceChange={handleUnitPriceChange}
        handleUnlock={handleUnlock}
        isLocked={isLocked}
        hasChanges={hasChanges}
        isSaving={isSaving}
        templateData={localData}
        templateSummaryData={templateSummaryData}
      />
    </div>
  );
}
