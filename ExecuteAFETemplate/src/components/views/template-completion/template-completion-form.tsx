import { TemplateCompletionTableContainer } from "@/components/table";
import type { TemplateFormData } from "@/forms/form-schemas";
import { useFormStyles } from "@/styles/template-completion-form";
import type { TemplateCompletionData, Unit } from "@/types/template";
import { formatCurrency } from "@/utils/functions";
import { Button, MessageBar, Text, tokens } from "@fluentui/react-components";
import { SaveRegular, SendRegular } from "@fluentui/react-icons";
import type { FC } from "react";
import AttachmentManager from "./attachment-manager";

type TemplateCompletionProps = {
  templateData: TemplateCompletionData;
  templateSummaryData: TemplateFormData;
  hasChanges: boolean;
  handleSave: () => Promise<void>;
  handleSendingAFEExecute: () => void;
  isSending: boolean;
  isSaving: boolean;
  isLocked: boolean;
  templateSummaryId: string;
  handleQuantityChange: (lineItemDetailId: string, newQuantity: number) => void;
  handleUnitPriceChange: (
    lineItemDetailId: string,
    newUnitPrice: number,
  ) => void;
  handleUnitChange: (lineItemDetailId: string, newUnit: Unit) => void;
};
export const TemplateCompletionForm: FC<TemplateCompletionProps> = ({
  templateData,
  templateSummaryData,
  hasChanges,
  handleSave,
  handleSendingAFEExecute,
  isSending,
  isSaving,
  isLocked,
  handleQuantityChange,
  handleUnitPriceChange,
  handleUnitChange,
  templateSummaryId,
}) => {
  const styles = useFormStyles();

  return (
    <fieldset
    // disabled={isLocked}
    // className={isLocked ? styles.lockedOverlay : ""}
    >
      <div className={styles.container}>
        {hasChanges && !isLocked && (
          <MessageBar intent="info">
            You have unsaved changes. Click "Save" to save your progress.
          </MessageBar>
        )}

        <div className={`${styles.header} ${styles.grandTotalSection}`}>
          <div>
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>
              Grand Total:
            </Text>
            <Text weight="semibold">
              {` ${formatCurrency(
                templateSummaryData.templateSummary?.xomuog_grandtotal ?? 0,
              )}`}
            </Text>
          </div>

          <div className={styles.actionButtons}>
            <Button
              appearance="primary"
              icon={<SaveRegular />}
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {templateSummaryId && (
              <Button
                appearance="primary"
                icon={<SendRegular />}
                onClick={handleSendingAFEExecute}
                disabled={isSending || isLocked}
              >
                {isSending ? "Sending..." : "Send & Lock"}
              </Button>
            )}
          </div>
        </div>

        <TemplateCompletionTableContainer
          templateData={templateData}
          templateSummaryData={templateSummaryData}
          onQuantityChange={handleQuantityChange}
          onUnitPriceChange={handleUnitPriceChange}
          onUnitChange={handleUnitChange}
          isLocked={isLocked}
        />

        {templateSummaryId && (
          <AttachmentManager
            templateSummaryId={
              templateSummaryData.templateSummary?.xomuog_templatesummaryid ??
              ""
            }
            isLocked={isLocked}
          />
        )}
      </div>
    </fieldset>
  );
};
