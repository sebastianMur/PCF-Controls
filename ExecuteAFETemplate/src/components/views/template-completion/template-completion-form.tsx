import { TemplateCompletionTableContainer } from "@/components/table";
import { SendForRevisionDialog } from "@/components/ui/confirmation-dialog";
import { RequiredFieldModal } from "@/components/ui/required-fields-dialog";
import { RevisionStatusDialog } from "@/components/ui/revision-status-dialog";
import type { TemplateFormData } from "@/forms/form-schemas";
import { useFormStyles } from "@/styles/template-completion-form";
import type { TemplateCompletionData, Unit } from "@/types/template";
import { AFE_STATUS_COLOR } from "@/utils/constants";
import { formatCurrency } from "@/utils/functions";
import {
  Badge,
  Button,
  MessageBar,
  Spinner,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowCounterclockwiseFilled,
  ClipboardTextEditColor,
  SaveRegular,
  SendColor,
} from "@fluentui/react-icons";
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
  templateSummaryId: string;
  handleQuantityChange: (lineItemDetailId: string, newQuantity: number) => void;
  handleUnitPriceChange: (
    lineItemDetailId: string,
    newUnitPrice: number,
  ) => void;
  handleUnitChange: (lineItemDetailId: string, newUnit: Unit) => void;
  isProjectNumberDefined: boolean;
  handleRefresh: () => void;
  isLoadingRevisionStatus: boolean;
  status?: string;
  isValidStatusForRevision: boolean;
  handleConfirm: () => void;
  openRevisionDialog: boolean;
  setOpenRevisionDialog: (open: boolean) => void;
  isLoadingSendForRevision: boolean;
  openRequiredFieldsDialog: boolean;
  setOpenRequiredDialog: (open: boolean) => void;
  requiredFieldsMessages: string[];
  setOpenRevisionStatusDialog: (open: boolean) => void;
  openRevisionStatusDialog: boolean;
};
export const TemplateCompletionForm: FC<TemplateCompletionProps> = ({
  templateData,
  templateSummaryData,
  hasChanges,
  handleSave,
  handleSendingAFEExecute,
  isSending,
  isSaving,
  handleQuantityChange,
  handleUnitPriceChange,
  handleUnitChange,
  templateSummaryId,
  isProjectNumberDefined,
  handleRefresh,
  isLoadingRevisionStatus,
  status,
  isValidStatusForRevision,
  handleConfirm,
  openRevisionDialog,
  openRequiredFieldsDialog,
  openRevisionStatusDialog,
  setOpenRequiredDialog,
  setOpenRevisionStatusDialog,
  requiredFieldsMessages,
  setOpenRevisionDialog,
  isLoadingSendForRevision,
}) => {
  const styles = useFormStyles();

  return (
    <>
      <fieldset>
        <div className={styles.container}>
          {hasChanges && !isProjectNumberDefined && (
            <MessageBar intent="info">
              You have unsaved changes. Click "Save" to save your progress.
            </MessageBar>
          )}

          <div className={`${styles.header} ${styles.grandTotalSection}`}>
            <div style={{ display: "flex", gap: 16 }}>
              <div>
                <Text
                  style={{
                    fontWeight: tokens.fontWeightSemibold,
                    marginRight: 5,
                  }}
                  size={300}
                >
                  Project Number:
                </Text>
                <Text
                  weight="semibold"
                  size={300}
                  style={{ backgroundColor: "white", padding: "5px" }}
                >
                  {templateSummaryData.templateSummary?.xomuog_projectnumber ??
                    ""}
                </Text>
              </div>

              <div>
                <Text
                  style={{
                    fontWeight: tokens.fontWeightSemibold,
                    marginRight: 5,
                  }}
                  size={300}
                >
                  Grand Total:
                </Text>
                <Text
                  weight="semibold"
                  size={300}
                  style={{ backgroundColor: "white", padding: "5px" }}
                >
                  {` ${formatCurrency(
                    templateSummaryData.templateSummary?.xomuog_grandtotal ?? 0,
                  )}`}
                </Text>
              </div>
            </div>

            <div className={styles.actionButtons}>
              {isProjectNumberDefined && (
                <Button
                  appearance="secondary"
                  style={{ border: "#EBF3FC" }}
                  iconPosition="after"
                  onClick={handleRefresh}
                >
                  {!isLoadingRevisionStatus ? (
                    <Badge
                      size="medium"
                      appearance="filled"
                      style={{
                        backgroundColor:
                          AFE_STATUS_COLOR?.[
                            status as keyof typeof AFE_STATUS_COLOR
                          ] || "#6B7280",
                        marginRight: 8,
                      }}
                      className={styles.badge}
                    >
                      {status}
                    </Badge>
                  ) : (
                    <Spinner
                      size="tiny"
                      style={{
                        marginRight: 8,
                      }}
                    />
                  )}
                  <ArrowCounterclockwiseFilled fontSize={18} />
                </Button>
              )}

              <Button
                appearance="primary"
                icon={<SaveRegular />}
                onClick={handleSave}
                disabled={
                  isSaving ||
                  (isProjectNumberDefined && !isValidStatusForRevision)
                }
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {templateSummaryId && !isProjectNumberDefined && (
                <Button
                  appearance="primary"
                  icon={<SendColor />}
                  onClick={handleSendingAFEExecute}
                  disabled={isSending || requiredFieldsMessages.length > 0}
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              )}

              {templateSummaryId && isProjectNumberDefined && (
                <Button
                  appearance="primary"
                  icon={<ClipboardTextEditColor />}
                  onClick={() => setOpenRevisionDialog(true)}
                  disabled={
                    isLoadingSendForRevision ||
                    hasChanges ||
                    (isProjectNumberDefined && !isValidStatusForRevision)
                  }
                >
                  {isLoadingSendForRevision ? "Sending..." : "Send Revision"}
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
            isLocked={!isValidStatusForRevision && isProjectNumberDefined}
          />

          {templateSummaryId && (
            <AttachmentManager
              templateSummaryId={
                templateSummaryData.templateSummary?.xomuog_templatesummaryid ??
                ""
              }
              isLocked={isProjectNumberDefined}
            />
          )}
        </div>
      </fieldset>
      <SendForRevisionDialog
        onConfirm={handleConfirm}
        onOpenChange={setOpenRevisionDialog}
        open={openRevisionDialog}
        isLoadingData={isLoadingSendForRevision}
      />
      <RequiredFieldModal
        requiredFieldsMessages={requiredFieldsMessages}
        onOpenChange={setOpenRequiredDialog}
        open={openRequiredFieldsDialog}
      />
      <RevisionStatusDialog
        onOpenChange={setOpenRevisionStatusDialog}
        open={openRevisionStatusDialog}
      />
    </>
  );
};
