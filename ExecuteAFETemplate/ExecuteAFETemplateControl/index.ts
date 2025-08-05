import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import type { ContextPage } from '../src/types';
import { createStore, setBaseUrl, setTemplateId, setTemplateSummaryId, setWPNId, } from '@/store';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { AppProviders } from '@/app/provider';
import TemplateCompletionContainer from '@/components/views/template-completion/template-completion-container';
import { setNotifyOutputChange } from '@/utils/notifyOutputChange';
import { getLookupId } from '@/utils/functions';
import { FluentProvider, MessageBar ,webLightTheme} from '@fluentui/react-components';

export class ExecuteAFETemplateControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private store: ReturnType<typeof createStore>;
  constructor() {
    this.store = createStore();
  }

  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
    const { page } = context as unknown as ContextPage;
    setNotifyOutputChange(notifyOutputChanged)

    try {
      this.store.dispatch(setBaseUrl(page.getClientUrl()));
      this.store.dispatch(setWPNId(page.entityId));
    } catch (_error) {
      if (context.parameters.DevelopmentEntityId.raw)
        this.store.dispatch(setWPNId(context.parameters.DevelopmentEntityId.raw));
      this.store.dispatch(setBaseUrl('http://localhost:3030'));
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>):
    ReactElement {
    const templateLookup = context.parameters.templateId.raw;
    const templateSummaryLookup = context.parameters.templateSummaryId.raw;

    const templateId = getLookupId(templateLookup);
    const templateSummaryId = getLookupId(templateSummaryLookup);

    this.store.dispatch(setTemplateId(templateId ?? ""));
    this.store.dispatch(setTemplateSummaryId(templateSummaryId ?? ""));

    if (!templateId) {
return createElement(
  FluentProvider,
  { theme: webLightTheme,style:{width:"100%"} },
  createElement(
    MessageBar,
    { intent: "warning" },
    "No template selected."
  )
);
    }

    return createElement(
      Provider,
      { store: this.store } as ProviderProps,
      createElement(AppProviders, null, createElement(TemplateCompletionContainer)),
    );
  }

  public getOutputs(): IOutputs {
    const states = this.store.getState()
    const templateSummaryId = states.context.templateSummaryId
    return { templateSummaryId: [{ entityType: "xomuog_templatesummary", id: templateSummaryId, name: "Saved Record" }] as ComponentFramework.LookupValue[] };
  }

  public destroy(): void { }
}
