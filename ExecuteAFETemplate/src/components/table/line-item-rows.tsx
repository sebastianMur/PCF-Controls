import { useTableStyles } from "@/styles/template-completion-table";
import type { LineItem, LineItemDetails, Unit } from "@/types/template";
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
  formatCurrency: (amount: number) => string;
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
    formatCurrency,
    unitOptions,
  }) => {
    const styles = useTableStyles();
    return (
      <TableRow className={styles.lineItemRow}>
        <TableCell className={`${styles.lineItemCell} ${styles.itemColumn}`}>
          <Text className={styles.cellContent}>{item.name}</Text>
        </TableCell>
        <TableCell>
          <Text className={styles.readonlyCell}>-</Text>
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={String(detail.unitPrice)}
            min="0"
            contentBefore="$"
            disabled={isLocked}
            onChange={(_e, d) =>
              onUnitPriceChange(
                detail.lineItemDetailId,
                Number.parseFloat(d.value) || 0,
              )
            }
          />
        </TableCell>
        <TableCell>
          <Dropdown
            value={detail.unit.value}
            disabled={isLocked}
            onOptionSelect={(
              _event: SelectionEvents,
              d: OptionOnSelectData,
            ) => {
              const unit = unitOptions.find(
                (u: Unit) => u.value === d.optionValue,
              );
              unit && onUnitChange(detail.lineItemDetailId, unit);
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
            value={String(detail.quantity)}
            min="0"
            disabled={isLocked}
            onChange={(_e, d) =>
              onQuantityChange(detail.lineItemDetailId, Number(d.value) || 0)
            }
          />
        </TableCell>

        <TableCell>
          <Text weight="semibold">{formatCurrency(detail.total)}</Text>
        </TableCell>
      </TableRow>
    );
  },
);
