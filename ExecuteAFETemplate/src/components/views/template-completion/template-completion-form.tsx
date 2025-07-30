import { TemplateCompletionTableContainer } from "@/components/table";
import { useSaveTemplateCompletionMutation } from "@/store/template-completion-api";
import { useFormStyles } from "@/styles/template-completion-form";
import type { TemplateCompletionData, Unit } from "@/types/template";
import {
  adjustUnitPricesProportionally,
  updateLineItemQuantity,
  updateLineItemUnit,
  updateLineItemUnitPrice,
} from "@/utils/calculations";
import {
  Button,
  Field,
  Input,
  MessageBar,
  Text,
  tokens,
} from "@fluentui/react-components";
import { PresenceBlockedRegular, SaveRegular } from "@fluentui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import AttachmentManager from "./attachment-manager";

const grandTotalSchema = z.object({
  grandTotal: z.coerce.number().min(0, "Grand total must be positive"),
});

type GrandTotalFormData = z.infer<typeof grandTotalSchema>;

interface TemplateCompletionFormProps {
  data: TemplateCompletionData;
  onDataChange: (data: TemplateCompletionData) => void;
}

export const TemplateCompletionForm = ({
  data,
  onDataChange,
}: TemplateCompletionFormProps) => {
  const styles = useFormStyles();
  const [isLocked, setIsLocked] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [saveTemplateCompletion, { isLoading: isSaving }] =
    useSaveTemplateCompletionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GrandTotalFormData>({
    resolver: zodResolver(grandTotalSchema),
    defaultValues: {
      grandTotal: data.templateSummary.grandTotal,
    },
  });

  const watchedGrandTotal = watch("grandTotal");

  const handleQuantityChange = (
    lineItemDetailId: string,
    newQuantity: number,
  ): void => {
    if (isLocked) return;

    const updatedData = updateLineItemQuantity(
      data,
      lineItemDetailId,
      newQuantity,
    );
    onDataChange(updatedData);
    setValue("grandTotal", updatedData.templateSummary.grandTotal);
    setHasChanges(true);
  };

  const handleUnitPriceChange = (
    lineItemDetailId: string,
    newUnitPrice: number,
  ): void => {
    if (isLocked) return;

    const updatedData = updateLineItemUnitPrice(
      data,
      lineItemDetailId,
      newUnitPrice,
    );
    onDataChange(updatedData);
    setValue("grandTotal", updatedData.templateSummary.grandTotal);
    setHasChanges(true);
  };

  const handleUnitChange = (lineItemDetailId: string, newUnit: Unit): void => {
    if (isLocked) return;

    const updatedData = updateLineItemUnit(data, lineItemDetailId, newUnit);
    onDataChange(updatedData);
    setHasChanges(true);
  };

  const handleGrandTotalChange = (formData: GrandTotalFormData): void => {
    if (isLocked) return;

    const updatedData = adjustUnitPricesProportionally(
      data,
      formData.grandTotal,
    );
    onDataChange(updatedData);
    setHasChanges(true);
  };

  const handleSave = async (): Promise<void> => {
    try {
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

  return (
    <fieldset
      disabled={isLocked}
      className={isLocked ? styles.lockedOverlay : ""}
    >
      <div className={styles.container}>
        <PageHeader
          data={data}
          handleSave={handleSave}
          handleUnlock={handleUnlock}
          hasChanges={hasChanges}
          isLocked={isLocked}
          isSaving={isSaving}
        />
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
        <form onSubmit={handleSubmit(handleGrandTotalChange)}>
          <div className={styles.grandTotalSection}>
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>
              Grand Total:
            </Text>
            <Field
              validationState={errors.grandTotal ? "error" : "none"}
              validationMessage={errors.grandTotal?.message}
            >
              <Controller
                name="grandTotal"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value.toString()}
                    step="0.01"
                    className={styles.grandTotalInput}
                    contentBefore="$"
                  />
                )}
              />
            </Field>
            <Button
              appearance="secondary"
              type="submit"
              disabled={watchedGrandTotal === data.templateSummary.grandTotal}
            >
              Adjust Proportionally
            </Button>
          </div>
        </form>
        <TemplateCompletionTableContainer
          data={data}
          onQuantityChange={handleQuantityChange}
          onUnitPriceChange={handleUnitPriceChange}
          onUnitChange={handleUnitChange}
          isLocked={isLocked}
        />
        <AttachmentManager
          templateSummaryId={data.templateSummary.templateSummaryId}
          isLocked={isLocked}
        />
      </div>
    </fieldset>
  );
};

type PageHeaderProps = {
  data: TemplateCompletionData;
  isSaving: boolean;
  isLocked: boolean;
  handleUnlock: () => void;
  handleSave: () => Promise<void>;
  hasChanges: boolean;
};
const PageHeader: FC<PageHeaderProps> = ({
  data,
  isSaving,
  isLocked,
  handleUnlock,
  handleSave,
  hasChanges,
}) => {
  const styles = useFormStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Text className={styles.title}>{data.templateSummary.name}</Text>
        <Text className={styles.subtitle}>
          Template Completion - Fill in quantities and adjust totals as needed
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
  );
};
