import { makeStyles, tokens } from "@fluentui/react-components";

export const useTemplateCompletionStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  tableContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
    maxHeight: "400px",
    overflowY: "auto",
  },
  columnHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  categoryRow: {
    backgroundColor: "#1f4e79",
    color: tokens.colorNeutralForegroundOnBrand,
  },
  categoryCell: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    fontWeight: tokens.fontWeightBold,
  },
  subcategoryRow: {
    backgroundColor: "#ffc000",
    color: tokens.colorNeutralForeground1,
  },
  subcategoryCell: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    fontWeight: tokens.fontWeightSemibold,
    paddingLeft: tokens.spacingHorizontalM,
  },
  lineItemRow: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  lineItemCell: {
    paddingLeft: tokens.spacingHorizontalXL,
    color: tokens.colorNeutralForeground1,
  },
  quantityInput: {
    width: "80px",
  },
  editableIndicator: {
    color: tokens.colorBrandForeground1,
    marginLeft: tokens.spacingHorizontalXXS,
  },
  footerNote: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
});
