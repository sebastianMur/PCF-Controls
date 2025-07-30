import type { TemplateCompletionData, Unit } from "@/types/template";
import { useCallback, useState } from "react";
import { TemplateCompletionTable } from "./table-view";

export type TableContainerProps = {
  data: TemplateCompletionData;
  onQuantityChange: (lineItemDetailId: string, newQuantity: number) => void;
  onUnitPriceChange: (lineItemDetailId: string, newUnitPrice: number) => void;
  onUnitChange: (lineItemDetailId: string, newUnit: Unit) => void;
  isLocked: boolean;
};

export const TemplateCompletionTableContainer: React.FC<
  TableContainerProps
> = ({ data, onQuantityChange, onUnitPriceChange, onUnitChange, isLocked }) => {
  const [expandedGFCM, setExpandedGFCM] = useState<Set<string>>(new Set());

  const toggleSubcategory = useCallback((id: string) => {
    setExpandedGFCM(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <TemplateCompletionTable
      data={data}
      expandedGFCM={expandedGFCM}
      onToggleGFCM={toggleSubcategory}
      onQuantityChange={onQuantityChange}
      onUnitPriceChange={onUnitPriceChange}
      onUnitChange={onUnitChange}
      isLocked={isLocked}
    />
  );
};
