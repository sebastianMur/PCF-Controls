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
  data: TemplateCompletionData;
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
      data,
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
                  {[
                    "Item",
                    "GFCM Name",
                    "Unit Price",
                    "Unit",
                    "Quantity",
                    "Total",
                  ].map(header => (
                    <TableHeaderCell
                      key={header}
                      // className={styles.headerCell}
                    >
                      {header}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.gfcms.map(gfcm => {
                  const gfcmSummary = data.gfcmSummaries.find(
                    s => s.gfcmId === gfcm.GFCMID,
                  );
                  if (!gfcmSummary) return null;

                  const isGFCMExpanded = !expandedGFCM.has(gfcm.GFCMID);

                  return (
                    <React.Fragment key={gfcm.GFCMID}>
                      <GFCMRow
                        summary={gfcmSummary}
                        gfcm={gfcm}
                        isExpanded={isGFCMExpanded}
                        onToggle={() => onToggleGFCM(gfcm.GFCMID)}
                        formatCurrency={formatCurrency}
                      />
                      {isGFCMExpanded &&
                        data.lineItemDetails
                          .filter(
                            li =>
                              li.gfcmSummaryId === gfcmSummary.gfcmSummaryId,
                          )
                          .map(detail => {
                            const item = data.lineItems.find(
                              li => li.lineItemId === detail.lineItemId,
                            );

                            if (!item) return;
                            return (
                              <LineItemRow
                                key={detail.lineItemDetailId}
                                detail={detail}
                                item={item}
                                onQuantityChange={onQuantityChange}
                                onUnitPriceChange={onUnitPriceChange}
                                onUnitChange={onUnitChange}
                                isLocked={isLocked}
                                formatCurrency={formatCurrency}
                                unitOptions={data.units}
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
