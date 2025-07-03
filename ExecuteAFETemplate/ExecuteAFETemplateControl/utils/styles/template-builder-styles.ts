import { makeStyles, tokens } from "@fluentui/react-components";

export const useTemplateBuilderStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalL,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalXS,
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
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "256px",
  },
  columnHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
    userSelect: "none",
    position: "relative",
    transition: "all 0.2s ease",
  },
  columnHeaderDragOver: {
    backgroundColor: tokens.colorBrandBackground2,
    border: `2px dashed ${tokens.colorBrandStroke1}`,
  },
  columnHeaderDragging: {
    opacity: "0.5",
    backgroundColor: tokens.colorBrandBackground2,
  },
  columnHeaderContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalXS,
  },
  columnHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
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
  itemHeaderCell: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
});
