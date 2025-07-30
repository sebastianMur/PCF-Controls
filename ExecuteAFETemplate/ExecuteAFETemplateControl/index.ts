import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import type { ContextPage } from '../src/types';
import { createStore, setBaseUrl, setTemplateId, setTemplateMode, setWPNId } from '@/store';
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
    const templateMode = context.parameters.TemplateMode.raw;
    const templateId = context.parameters.templateId.raw;
    const wpnId = context.parameters.WPNId.raw;
    if(wpnId && wpnId !== "val" && templateId && templateId !== "val" ){
      this.store.dispatch(setWPNId(wpnId));
      this.store.dispatch(setTemplateId(templateId));
    }
    this.store.dispatch(setTemplateMode(templateMode));

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
