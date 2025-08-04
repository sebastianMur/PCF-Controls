import { useTableStyles } from "@/styles/template-completion-table";
import type { GFCM, GFCMSummary } from "@/types/template";
import {
  Button,
  TableCell,
  TableRow,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { memo } from "react";

export const GFCMRow: React.FC<{
  summary: GFCMSummary;
  gfcm?: GFCM;
  isExpanded: boolean;
  onToggle(): void;
  formatCurrency(amount: number): string;
}> = memo(({ summary, gfcm, isExpanded, onToggle, formatCurrency }) => {
  const styles = useTableStyles();
  return (
    <TableRow className={styles.subcategoryRow}>
      <TableCell className={`${styles.subcategoryCell} ${styles.itemColumn}`}>
        <Button
          appearance="subtle"
          size="small"
          icon={
            isExpanded ? <ChevronDown20Regular /> : <ChevronRight20Regular />
          }
          onClick={onToggle}
          style={{ color: tokens.colorNeutralForeground1 }}
        />
        <Text weight="semibold">{gfcm?.xomuog_gfcmcode}</Text>-
        <Text weight="semibold">{gfcm?.xomuog_name ?? "-"}</Text>
      </TableCell>

      <TableCell>
        <Text>-</Text>
      </TableCell>
      <TableCell>
        <Text>-</Text>
      </TableCell>
      <TableCell>
        <Text>-</Text>
      </TableCell>
      <TableCell>
        <Text weight="semibold">{formatCurrency(summary.xomuog_total)}</Text>
      </TableCell>
    </TableRow>
  );
});
