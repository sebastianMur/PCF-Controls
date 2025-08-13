import { useTableStyles } from "@/styles/template-completion-table";
import type { LineItem, LineItemDetails, Unit } from "@/types/template";
import { formatCurrency } from "@/utils/functions";
import {
  Dropdown,
  Input,
  Option,
  type OptionOnSelectData,
  type SelectionEvents,
  TableCell,
  TableRow,
  Text,
} from "@fluentui/react-components";
import { type FC, memo } from "react";

type LineItemRowProps = {
  detail: LineItemDetails;
  item: LineItem;
  onQuantityChange: (lineItemDetailId: string, quantity: number) => void;
  onUnitPriceChange: (lineItemDetailId: string, unitPrice: number) => void;
  onUnitChange: (lineItemDetailId: string, unit: Unit) => void;
  isLocked: boolean;
  unitOptions: Unit[];
};

export const LineItemRow: FC<LineItemRowProps> = memo(
  ({
    detail,
    item,
    onQuantityChange,
    onUnitPriceChange,
    onUnitChange,
    isLocked,
    unitOptions,
  }) => {
    const styles = useTableStyles();

    return (
      <TableRow className={styles.lineItemRow}>
        <TableCell className={`${styles.lineItemCell} ${styles.itemColumn}`}>
          <Text className={styles.cellContent}>{item.xomuog_name}</Text>
        </TableCell>

        <TableCell>
          <Input
            type="text"
            value={String(detail.xomuog_unitprice ?? 0)}
            min="0"
            contentBefore="$"
            disabled={isLocked}
            onChange={(_e, d) =>
              onUnitPriceChange(
                detail.xomuog_lineitemdetailid,
                Number.parseFloat(d.value) || 0,
              )
            }
          />
        </TableCell>
        <TableCell>
          <Dropdown
            value={
              unitOptions.find(u => u.key === detail.xomuog_unit)?.value ?? ""
            }
            disabled={isLocked}
            onOptionSelect={(
              _event: SelectionEvents,
              d: OptionOnSelectData,
            ) => {
              const unit = unitOptions.find(
                (u: Unit) => u.value === d.optionValue,
              );
              unit && onUnitChange(detail.xomuog_lineitemdetailid, unit);
            }}
            style={{ minWidth: "max-content" }}
          >
            {unitOptions.map((opt: Unit) => (
              <Option key={opt.key} value={opt.value}>
                {opt.value}
              </Option>
            ))}
          </Dropdown>
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={String(detail.xomuog_quantity ?? 0)}
            min="0"
            disabled={isLocked}
            onChange={(_e, d) =>
              onQuantityChange(
                detail.xomuog_lineitemdetailid,
                Number(d.value) || 0,
              )
            }
          />
        </TableCell>

        <TableCell>
          <Text weight="semibold">{formatCurrency(detail.xomuog_total)}</Text>
        </TableCell>
      </TableRow>
    );
  },
);
