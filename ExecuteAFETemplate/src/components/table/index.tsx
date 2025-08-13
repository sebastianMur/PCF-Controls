import type { TemplateFormData } from "@/forms/form-schemas";
import type { TemplateCompletionData, Unit } from "@/types/template";
import { TemplateCompletionTable } from "./table-view";

export type TableContainerProps = {
  templateData: TemplateCompletionData;
  templateSummaryData: TemplateFormData;
  onQuantityChange: (lineItemDetailId: string, newQuantity: number) => void;
  onUnitPriceChange: (lineItemDetailId: string, newUnitPrice: number) => void;
  onUnitChange: (lineItemDetailId: string, newUnit: Unit) => void;
  isLocked: boolean;
};

export const TemplateCompletionTableContainer: React.FC<
  TableContainerProps
> = ({
  templateData,
  templateSummaryData,
  onQuantityChange,
  onUnitPriceChange,
  onUnitChange,
  isLocked,
}) => {
  return (
    <TemplateCompletionTable
      templateData={templateData}
      templateSummaryData={templateSummaryData}
      onQuantityChange={onQuantityChange}
      onUnitPriceChange={onUnitPriceChange}
      onUnitChange={onUnitChange}
      isLocked={isLocked}
    />
  );
};
