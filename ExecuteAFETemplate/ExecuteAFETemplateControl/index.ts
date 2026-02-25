import { AppProviders } from "@/app/provider";
import TemplateCompletionContainer from "@/components/views/template-completion/template-completion-container";
import {
  createStore,
  setBaseUrl,
  setPAAlignment,
  setTemplateId,
  setTemplateSummaryId,
  setWPNId,
} from "@/store";
import { getLookupId } from "@/utils/functions";
import { setNotifyOutputChange } from "@/utils/notifyOutputChange";
import {
  FluentProvider,
  MessageBar,
  webLightTheme,
} from "@fluentui/react-components";
import { createElement } from "react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import type { ProviderProps } from "react-redux";
import type { ContextPage } from "../src/types";
import type { IInputs, IOutputs } from "./generated/ManifestTypes";
export class ExecuteAFETemplateControl
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private OPTION_SET_PA_ALIGNMENT = 723710000;
  private store: ReturnType<typeof createStore>;
  private isLocal =
    window.location.hostname === "localhost" ||
    window.location.href.includes("localhost");

  constructor() {
    this.store = createStore();
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
  ): void {
    const { page } = context as unknown as ContextPage;
    setNotifyOutputChange(notifyOutputChanged);

    if (this.isLocal) {
      if (context.parameters.DevelopmentEntityId.raw) {
        this.store.dispatch(
          setWPNId(context.parameters.DevelopmentEntityId.raw),
        );
        this.store.dispatch(setBaseUrl("http://localhost:3030"));
      }
    } else {
      this.store.dispatch(setBaseUrl(page.getClientUrl()));
      this.store.dispatch(setWPNId(page.entityId));
    }
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>,
  ): ReactElement {
    const { page } = context as unknown as ContextPage;
    const templateLookup = context.parameters.templateId.raw;
    const templateSummaryLookup = context.parameters.templateSummaryId.raw;
    const paAlignment = context.parameters.paAlignment.raw;

    const templateId = getLookupId(templateLookup);
    const templateSummaryId = getLookupId(templateSummaryLookup);

    this.store.dispatch(setTemplateId(templateId ?? ""));
    this.store.dispatch(setTemplateSummaryId(templateSummaryId ?? ""));

    if (!templateId || !(this.isLocal || page?.entityId)) {
      this.store.dispatch(setWPNId(page.entityId));
      return createElement(
        FluentProvider,
        { theme: webLightTheme, style: { width: "100%" } },
        createElement(
          MessageBar,
          { intent: "warning" },
          !templateId
            ? "Please select a template to continue."
            : "Save the record to view this section.",
        ),
      );
    }

    const isPaAlignment = paAlignment !== this.OPTION_SET_PA_ALIGNMENT && templateLookup[0]?.name?.startsWith("PA") === true;

    this.store.dispatch(setPAAlignment(isPaAlignment));

    return createElement(
      Provider,
      { store: this.store } as ProviderProps,
      createElement(
        AppProviders,
        null,
        createElement(TemplateCompletionContainer),
      ),
    );
  }

  public getOutputs(): IOutputs {
    const states = this.store.getState();
    const templateSummaryId = states.context.templateSummaryId;

    return {
      templateSummaryId: [
        {
          entityType: "xomuog_templatesummary",
          id: templateSummaryId,
          name: "Saved Record",
        },
      ] as ComponentFramework.LookupValue[],
    };
  }

  public destroy(): void {}
}
