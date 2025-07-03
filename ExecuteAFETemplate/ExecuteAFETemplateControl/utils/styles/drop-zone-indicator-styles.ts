import { makeStyles, tokens } from "@fluentui/react-components";

export const useDropZoneIndicatorStyles = makeStyles({
  indicator: {
    position: "absolute",
    top: "0",
    bottom: "0",
    width: "4px",
    backgroundColor: tokens.colorBrandBackground,
    zIndex: 10,
    animationName: {
      "0%": { opacity: "0.5" },
      "50%": { opacity: "1" },
      "100%": { opacity: "0.5" },
    },
    animationDuration: "1s",
    animationIterationCount: "infinite",
    boxShadow: `0 0 8px ${tokens.colorBrandBackground}`,
  },
  left: {
    left: "0",
  },
  right: {
    right: "0",
  },
});
