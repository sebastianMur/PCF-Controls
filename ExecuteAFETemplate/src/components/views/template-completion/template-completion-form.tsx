import { TemplateCompletionTableContainer } from "@/components/table";
import type { TemplateFormData } from "@/forms/form-schemas";
import { useFormStyles } from "@/styles/template-completion-form";
import type { TemplateCompletionData, Unit } from "@/types/template";
import { formatCurrency } from "@/utils/functions";
import { Button, MessageBar, Text, tokens } from "@fluentui/react-components";
import { PresenceBlockedRegular, SaveRegular } from "@fluentui/react-icons";
import type { FC } from "react";
import type { FieldErrors } from "react-hook-form";
import AttachmentManager from "./attachment-manager";

type TemplateCompletionProps = {
  isLocked: boolean;
  templateData: TemplateCompletionData;
  templateSummaryData: TemplateFormData;
  hasChanges: boolean;
  handleSave: () => Promise<void>;
  handleUnlock: () => void;
  isSaving: boolean;
  errors: FieldErrors<TemplateFormData>;
  handleQuantityChange: (lineItemDetailId: string, newQuantity: number) => void;
  handleUnitPriceChange: (
    lineItemDetailId: string,
    newUnitPrice: number,
  ) => void;
  handleUnitChange: (lineItemDetailId: string, newUnit: Unit) => void;
};
export const TemplateCompletionForm: FC<TemplateCompletionProps> = ({
  isLocked,
  templateData,
  templateSummaryData,
  hasChanges,
  handleSave,
  handleUnlock,
  isSaving,
  handleQuantityChange,
  handleUnitPriceChange,
  handleUnitChange,
}) => {
  const styles = useFormStyles();

  return (
    <fieldset
      disabled={isLocked}
      className={isLocked ? styles.lockedOverlay : ""}
    >
      <div className={styles.container}>
        {hasChanges && !isLocked && (
          <MessageBar intent="info">
            You have unsaved changes. Click "Save & Lock" to save your progress.
          </MessageBar>
        )}
        {isLocked && (
          <MessageBar intent="success">
            Template is locked and saved. Click "Unlock Template" to make
            changes.
          </MessageBar>
        )}

        <div className={`${styles.header} ${styles.grandTotalSection}`}>
          <div>
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>
              Grand Total:
            </Text>
            <Text weight="semibold">
              {formatCurrency(
                templateSummaryData.templateSummary?.xomuog_grandtotal ?? 0,
              )}
            </Text>
          </div>

          <div className={styles.actionButtons}>
            {isLocked ? (
              <Button
                appearance="secondary"
                icon={<PresenceBlockedRegular />}
                onClick={handleUnlock}
              >
                Unlock Template
              </Button>
            ) : (
              <Button
                appearance="primary"
                icon={<SaveRegular />}
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? "Saving..." : "Save & Lock"}
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
        <AttachmentManager
          templateSummaryId={
            templateSummaryData.templateSummary?.xomuog_templatesummaryid ?? ""
          }
          isLocked={isLocked}
        />
      </div>
    </fieldset>
  );
};
