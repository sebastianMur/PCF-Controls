import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import type { ContextPage } from '../src/types';
import { createStore, setBaseUrl, setTemplateId,  setTemplateSummaryId, } from '@/store';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { AppProviders } from '@/app/provider';
import TemplateCompletionContainer from '@/components/views/template-completion/template-completion-container';

export class ExecuteAFETemplateControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private store: ReturnType<typeof createStore>;

  constructor() {
    this.store = createStore();
  }

  public init(context: ComponentFramework.Context<IInputs>): void {
    const { page } = context as unknown as ContextPage;


    try {
      this.store.dispatch(setBaseUrl(page.getClientUrl()));
    } catch (_error) {
      this.store.dispatch(setBaseUrl('http://localhost:3030'));
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>): // context: ComponentFramework.Context<IInputs>,
  ReactElement {
       const templateLookup = context.parameters.templateId.raw;
    const templateSummaryLookup = context.parameters.templateSummaryId.raw;

    const getLookupId = (lookup: any): string | undefined => {
      if (Array.isArray(lookup) && lookup.length > 0 && lookup[0]?.id) {
        return lookup[0].id;
      }

      if (typeof lookup === "string") {
        return lookup;
      }

      return undefined;
    };

    const templateId = getLookupId(templateLookup);
    const templateSummaryId = getLookupId(templateSummaryLookup);

    if (templateId) {
      this.store.dispatch(setTemplateId(templateId));
    }

    if (templateSummaryId) {
      this.store.dispatch(setTemplateSummaryId(templateSummaryId));
    }
    
    
    return createElement(
      Provider,
      { store: this.store } as ProviderProps,
      createElement(AppProviders, null, createElement(TemplateCompletionContainer)),
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {}
}
