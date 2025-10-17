import { useGetDefaultValues } from "@/forms/form-config";
import type {
  TemplateFormData,
  TemplateSummaryFormData,
} from "@/forms/form-schemas";
import { useAppSelector } from "@/hooks";
import {
  fromTemplateToTemplateSummaryOnSave,
  toApiTemplateSummary,
} from "@/mappers/template-mapper";
import { useLazyGetNotesQuery } from "@/services/notes";
import { useLazyGetTemplateQuery } from "@/services/template";
import {
  useGetAFEStatusQuery,
  useLazyGetTemplateSummaryQuery,
  useSendAFEForRevisionMutation,
  useUpdateTemplateSummaryMutation,
} from "@/services/templateSummary";
import { useLazyGetWPNQuery } from "@/services/wpn";
import {
  selectTemplateId,
  selectTemplateSummaryId,
  selectWPNId,
} from "@/store";
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
import { getTemplateSummaryRequiredFields } from "@/utils/functions";
import { triggerNotifyOutputChange } from "@/utils/notifyOutputChange";
import { MessageBar, Spinner } from "@fluentui/react-components";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { TemplateCompletionForm } from "./template-completion-form";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare const Xrm: any;

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
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [openRequiredFieldsDialog, setOpenRequiredDialog] = useState(false);
  const [openRevisionStatusDialog, setOpenRevisionStatusDialog] =
    useState(false);
  const wpnId = useAppSelector(selectWPNId);

  const {
    data: templateData,
    error,
    isLoading,
  } = useGetTemplateCompletionDataQuery({ templateId }, { skip: !templateId });

  const [getWPN] = useLazyGetWPNQuery();
  const [getTemplateFormData] = useLazyGetTemplateQuery();
  const [getTemplateSummaryFormData] = useLazyGetTemplateSummaryQuery();
  const [getAttachments] = useLazyGetNotesQuery();

  const [saveTemplateCompletion, { isLoading: isSaving }] =
    useSaveTemplateCompletionMutation();
  const [updateTemplateSummary] = useUpdateTemplateSummaryMutation();

  const [sendToAFEExecute, { isLoading: isSending }] =
    useSendToAFEExecuteMutation();

  const [sendForRevision, { isLoading: isLoadingSendForRevision }] =
    useSendAFEForRevisionMutation();

  const { getInitialTemplateValues } = useGetDefaultValues();

  const { control, setValue, getValues, reset } =
    useFormContext<TemplateFormData>();

  const templateSummaryData = useWatch({ control }) as TemplateFormData;
  // const isLocked =
  //   templateSummaryData.templateSummary?.statuscode === STATUS_REASON.Sent;
  const regex = /^(?!\s*$)(?!(###\s##\s##|###\s###\s###)$).+/;

  const isProjectNumberDefined = regex.test(
    templateSummaryData?.templateSummary?.xomuog_projectnumber ?? "",
  );
  const {
    data: status,
    // error,
    isLoading: isLoadingStatus,
    refetch,
    isFetching: isRefetching,
  } = useGetAFEStatusQuery(templateSummaryId, {
    skip: !isProjectNumberDefined,
  });

  console.log(
    "isProjectNumberDefined",
    isProjectNumberDefined,
    templateSummaryData.templateSummary?.xomuog_projectnumber,
  );

  const isValidStatusForRevision =
    status === "IREJ" || status === "IAPP" || status === "FAPP";

  const isLoadingRevisionStatus = isRefetching || isLoadingStatus;

  const handleQuantityChange = (
    lineItemDetailId: string,
    newQuantity: number,
  ): void => {
    // if (isLocked) return;
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
    // if (isLocked) return;
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
    // if (isLocked) return;
    const data = getValues();

    const updatedData = updateLineItemUnit(data, lineItemDetailId, newUnit);

    for (const [key, value] of Object.entries(updatedData)) {
      setValue(key as unknown as keyof TemplateFormData, value);
    }
    setHasChanges(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSave = async (): Promise<void> => {
    try {
      const data = getValues();

      // todo: Save Template first time
      if (
        !templateSummaryId ||
        (templateSummaryId &&
          data.templateSummary?.statuscode === STATUS_REASON.Sent)
      ) {
        await saveTemplateCompletion(data).unwrap();
      }

      // todo: Save Template to send AFE Records
      if (
        templateSummaryId &&
        data.templateSummary?.statuscode === STATUS_REASON.Active
      ) {
        const [templateSummaryData, wpn, template, attachments] =
          await Promise.all([
            getTemplateSummaryFormData(templateSummaryId).unwrap(),
            getWPN(wpnId).unwrap(),
            getTemplateFormData(templateId).unwrap(),
            getAttachments(templateSummaryId).unwrap(),
          ]);

        const fieldsToCheck = fromTemplateToTemplateSummaryOnSave(
          template,
          templateSummaryData,
          wpn,
        );
        const requiredFieldsMessages = getTemplateSummaryRequiredFields(
          fieldsToCheck,
          attachments.length > 0,
        );

        if (requiredFieldsMessages.length > 0) {
          setValue("requiredFieldsMessages", requiredFieldsMessages);
          setOpenRequiredDialog(true);
          return;
        }
        await saveTemplateCompletion({
          ...data,
          templateSummary: fieldsToCheck,
        }).unwrap();
      }

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
      let apiNumber = "N/A"; // Placeholder for API number if needed
      const data = getValues();
      if (templateSummaryId)
        apiNumber = await sendToAFEExecute(templateSummaryId).unwrap();

      await updateTemplateSummary({
        record: toApiTemplateSummary({
          ...data.templateSummary,
          xomuog_projectnumber: apiNumber,
          statuscode: STATUS_REASON.Sent,
        } as TemplateSummaryFormData),
        templateSummaryId,
      }).unwrap();

      setValue("templateSummary.xomuog_projectnumber", apiNumber);
      triggerNotifyOutputChange();
    } catch (error) {
      console.error("Failed to save template completion:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      const sts = await refetch().unwrap();

      const isValidStatus = sts === "IREJ" || sts === "IAPP" || sts === "FAPP";
      if (!isValidStatus) {
        setOpenRevisionStatusDialog(true);
        return;
      }

      const data = getValues();
      await sendForRevision({ templatesummaryid: templateSummaryId }).unwrap();

      await updateTemplateSummary({
        record: toApiTemplateSummary({
          ...data.templateSummary,
          statuscode: STATUS_REASON.SentforRevision,
        } as TemplateSummaryFormData),
        templateSummaryId,
      }).unwrap();

      triggerNotifyOutputChange();
      await refetch().unwrap();
    } catch (error) {
      console.error("Failed to save template completion:", error);
    }

    setOpenRevisionDialog(false);
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
        isProjectNumberDefined={isProjectNumberDefined}
        templateSummaryId={templateSummaryId}
        templateData={localData}
        templateSummaryData={templateSummaryData}
        handleRefresh={handleRefresh}
        isLoadingRevisionStatus={isLoadingRevisionStatus}
        status={status}
        isValidStatusForRevision={isValidStatusForRevision}
        handleConfirm={handleConfirm}
        openRevisionDialog={openRevisionDialog}
        setOpenRevisionDialog={setOpenRevisionDialog}
        setOpenRequiredDialog={setOpenRequiredDialog}
        openRequiredFieldsDialog={openRequiredFieldsDialog}
        isLoadingSendForRevision={isLoadingSendForRevision}
        requiredFieldsMessages={
          templateSummaryData.requiredFieldsMessages || []
        }
        setOpenRevisionStatusDialog={setOpenRevisionStatusDialog}
        openRevisionStatusDialog={openRevisionStatusDialog}
      />
    </div>
  );
}
