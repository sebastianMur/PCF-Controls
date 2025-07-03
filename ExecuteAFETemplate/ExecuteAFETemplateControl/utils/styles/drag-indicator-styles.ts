import { makeStyles, tokens } from "@fluentui/react-components";

export const useDragIndicatorStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
    height: "16px",
    borderRadius: tokens.borderRadiusSmall,
    cursor: "move",
    transitionDuration: tokens.durationNormal,
    transitionProperty: "color, background-color",
  },
  default: {
    color: tokens.colorNeutralForeground3,
    ":hover": {
      color: tokens.colorNeutralForeground2,
    },
  },
  dragging: {
    color: tokens.colorBrandForeground1,
  },
  dropTarget: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
  },
});
