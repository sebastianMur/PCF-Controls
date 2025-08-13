import type { TemplateFormData } from "@/forms/form-schemas";
import { useTableStyles } from "@/styles/template-completion-table";
import type { TemplateCompletionData, Unit } from "@/types/template";
import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import {
  ArrowCollapseAllFilled,
  ArrowExpandAllFilled,
} from "@fluentui/react-icons";
import React, { memo, useCallback, useState } from "react";
import { GFCMRow } from "./gfcm-row";
import { LineItemRow } from "./line-item-rows";

interface TemplateCompletionTableProps {
  templateData: TemplateCompletionData;
  templateSummaryData: TemplateFormData;
  onQuantityChange: (lineItemDetailId: string, quantity: number) => void;
  onUnitPriceChange: (lineItemDetailId: string, unitPrice: number) => void;
  onUnitChange: (lineItemDetailId: string, unit: Unit) => void;
  isLocked: boolean;
}

export const TemplateCompletionTable: React.FC<TemplateCompletionTableProps> =
  memo(
    ({
      templateData,
      templateSummaryData,
      onQuantityChange,
      onUnitPriceChange,
      onUnitChange,
      isLocked,
    }) => {
      const styles = useTableStyles();
      const [expandedGFCM, setExpandedGFCM] = useState<Set<string>>(new Set());

      const onToggleGFCM = useCallback((id: string) => {
        setExpandedGFCM(prev => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }, []);

      // expand all
      const expandAll = () => {
        setExpandedGFCM(
          new Set(templateData.gfcms.map(gfcm => gfcm.xomuog_gfcmid)),
        );
      };

      // collapse all
      const collapseAll = () => {
        setExpandedGFCM(new Set());
      };

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
                    (header, idx) => {
                      const icon =
                        expandedGFCM.size > 0 ? (
                          <ArrowExpandAllFilled />
                        ) : (
                          <ArrowCollapseAllFilled />
                        );

                      return (
                        <TableHeaderCell
                          key={header}
                          // className={styles.headerCell}
                        >
                          {header}

                          {idx === 0 && (
                            <Button
                              appearance="transparent"
                              aria-label={
                                expandedGFCM.size > 0
                                  ? "Expand Records"
                                  : "Collapse Records"
                              }
                              size="small"
                              icon={icon}
                              onClick={() =>
                                expandedGFCM.size === templateData.gfcms.length
                                  ? collapseAll()
                                  : expandAll()
                              }
                            />
                          )}
                        </TableHeaderCell>
                      );
                    },
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
