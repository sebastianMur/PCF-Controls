import { makeStyles, tokens } from "@fluentui/react-components";

export const useTemplateCompletionContainerStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalL,
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
  },
});
