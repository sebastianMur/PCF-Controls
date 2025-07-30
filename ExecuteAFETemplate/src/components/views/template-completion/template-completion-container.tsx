import { useAppSelector } from "@/hooks";
import { selectTemplateId } from "@/store";
import { useGetTemplateCompletionDataQuery } from "@/store/template-completion-api";
import { useTemplateCompletionContainerStyles } from "@/styles/template-completion-container";
import type { TemplateCompletionData } from "@/types/template";
import { MessageBar, Spinner } from "@fluentui/react-components";
import { useState } from "react";
import { TemplateCompletionForm } from "./template-completion-form";

export default function TemplateCompletionContainer() {
  const templateId = useAppSelector(selectTemplateId);
  const styles = useTemplateCompletionContainerStyles();
  const [localData, setLocalData] = useState<TemplateCompletionData | null>(
    null,
  );

  const {
    data: templateData,
    error,
    isLoading,
  } = useGetTemplateCompletionDataQuery(templateId);

  // Initialize local data when API data is loaded
  if (templateData && !localData) {
    setLocalData(templateData);
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Loading template completion data..." />
      </div>
    );
  }

  if (error) {
    return (
      <MessageBar intent="error">
        Failed to load template completion data. Please try again.
      </MessageBar>
    );
  }

  if (!localData) {
    return (
      <MessageBar intent="warning">No template data available.</MessageBar>
    );
  }

  return (
    <div className={styles.container}>
      <TemplateCompletionForm data={localData} onDataChange={setLocalData} />
    </div>
  );
}
