import { useTemplateCompletionForm } from "@/forms/form-config";
import { FluentProvider } from "@fluentui/react-components";
import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormProvider } from "react-hook-form";
import { appTheme } from "./theme";
// import { FormProvider } from "react-hook-form";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  const methods = useTemplateCompletionForm();
  return (
    <FluentProvider theme={appTheme}>
      <FormProvider {...methods}>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </FormProvider>
    </FluentProvider>
  );
};
