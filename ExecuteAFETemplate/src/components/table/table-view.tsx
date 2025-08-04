import type { TemplateFormData } from "@/forms/form-schemas";
import { useTableStyles } from "@/styles/template-completion-table";
import type { TemplateCompletionData, Unit } from "@/types/template";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import React, { memo, useCallback } from "react";
import { GFCMRow } from "./gfcm-row";
import { LineItemRow } from "./line-item-rows";

interface TemplateCompletionTableProps {
  templateData: TemplateCompletionData;
  templateSummaryData: TemplateFormData;
  onQuantityChange: (lineItemDetailId: string, quantity: number) => void;
  onUnitPriceChange: (lineItemDetailId: string, unitPrice: number) => void;
  onUnitChange: (lineItemDetailId: string, unit: Unit) => void;
  isLocked: boolean;
  expandedGFCM: Set<string>;
  onToggleGFCM: (id: string) => void;
}

export const TemplateCompletionTable: React.FC<TemplateCompletionTableProps> =
  memo(
    ({
      templateData,
      templateSummaryData,
      expandedGFCM,
      onToggleGFCM,
      onQuantityChange,
      onUnitPriceChange,
      onUnitChange,
      isLocked,
    }) => {
      const styles = useTableStyles();

      const formatCurrency = useCallback(
        (amount: number) => `$${amount.toFixed(2)}`,
        [],
      );

      return (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <Table
              aria-label="Template completion table"
              className={styles.table}
            >
              <TableHeader>
                <TableRow>
                  {["Item", "Unit Price", "Unit", "Quantity", "Total"].map(
                    header => (
                      <TableHeaderCell
                        key={header}
                        // className={styles.headerCell}
                      >
                        {header}
                      </TableHeaderCell>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {templateData.gfcms.map(gfcm => {
                  const gfcmSummary = templateSummaryData.gfcmSummary?.find(
                    s => s.xomuog_gfcmid === gfcm.xomuog_gfcmid,
                  );
                  if (!gfcmSummary) return null;

                  const isGFCMExpanded = !expandedGFCM.has(gfcm.xomuog_gfcmid);

                  return (
                    <React.Fragment key={gfcm.xomuog_gfcmid}>
                      <GFCMRow
                        summary={gfcmSummary}
                        gfcm={gfcm}
                        isExpanded={isGFCMExpanded}
                        onToggle={() => onToggleGFCM(gfcm.xomuog_gfcmid)}
                        formatCurrency={formatCurrency}
                      />
                      {isGFCMExpanded &&
                        templateSummaryData.lineItemsDetails
                          ?.filter(
                            li =>
                              li.xomuog_gfcmsummaryid ===
                              gfcmSummary.xomuog_gfcmsummaryid,
                          )
                          .map(detail => {
                            const item = templateData.lineItems.find(
                              li =>
                                li.xomuog_lineitemid === detail.xomuog_lineitem,
                            );

                            if (!item) return;
                            return (
                              <LineItemRow
                                key={detail.xomuog_lineitemdetailid}
                                detail={detail}
                                item={item}
                                onQuantityChange={onQuantityChange}
                                onUnitPriceChange={onUnitPriceChange}
                                onUnitChange={onUnitChange}
                                isLocked={isLocked}
                                formatCurrency={formatCurrency}
                                unitOptions={templateData.units}
                              />
                            );
                          })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    },
  );
