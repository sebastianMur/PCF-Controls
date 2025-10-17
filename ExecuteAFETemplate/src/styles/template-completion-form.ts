import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useFormStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalL,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...shorthands.padding(tokens.spacingVerticalM),
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
  },
  badge: {
    ...shorthands.padding("0 8px"),
    ...shorthands.borderRadius("9999px"),
    fontWeight: 600,
    color: "white",
    border: "none",
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
  grandTotalSection: {
    display: "flex",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalM),
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    ...shorthands.border("2px", "solid", tokens.colorBrandStroke1),
  },
  grandTotalInput: {
    width: "200px",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalS,
  },
  lockedOverlay: {
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      zIndex: 10,
      pointerEvents: "none",
    },
  },
});
