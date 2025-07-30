import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useTableStyles = makeStyles({
  tableContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
    maxHeight: "600px",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
  },
  columnHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: "left",
    verticalAlign: "middle",
  },
  // Fixed column widths
  itemColumn: {
    width: "25%",
    minWidth: "200px",
  },
  quantityColumn: {
    width: "10%",
    minWidth: "80px",
  },
  unitPriceColumn: {
    width: "12%",
    minWidth: "100px",
  },
  unitColumn: {
    width: "12%",
    minWidth: "120px",
  },
  totalColumn: {
    width: "12%",
    minWidth: "100px",
  },
  gfcmIdColumn: {
    width: "14%",
    minWidth: "100px",
  },
  gfcmNameColumn: {
    width: "15%",
    minWidth: "120px",
  },
  categoryRow: {
    backgroundColor: "#1f4e79",
    color: tokens.colorNeutralForegroundOnBrand,
  },
  categoryCell: {
    display: "flex",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalXS,
    fontWeight: tokens.fontWeightBold,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    height: "44px",
    overflow: "hidden",
  },
  subcategoryRow: {
    // backgroundColor: "#ffc000",
    backgroundColor: "#1f4e79",
    color: tokens.colorNeutralForegroundOnBrand,

    // color: tokens.colorNeutralForeground1,
  },
  subcategoryCell: {
    display: "flex",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalXS,
    fontWeight: tokens.fontWeightSemibold,
    paddingLeft: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    height: "44px",
    overflow: "hidden",
  },
  lineItemRow: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  lineItemCell: {
    paddingLeft: tokens.spacingHorizontalXL,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    height: "44px",
    overflow: "hidden",
  },
  tableCell: {
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: "middle",
    height: "44px",
    overflow: "hidden",
  },
  quantityInput: {
    width: "70px",
    minWidth: "70px",
  },
  currencyCell: {
    textAlign: "right",
    fontFamily: "monospace",
  },
  unitDropdown: {
    width: "110px",
    minWidth: "110px",
  },
  unitPriceInput: {
    width: "90px",
    minWidth: "90px",
  },
  readonlyCell: {
    color: tokens.colorNeutralForeground2,
    fontStyle: "italic",
  },
  cellContent: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});
