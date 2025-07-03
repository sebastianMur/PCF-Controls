import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';

import { App } from '@components/app';
import type { IInputs, IOutputs } from '@generated/ManifestTypes';
import { createStore, setBaseUrl, setTemplateMode } from '@utils/store';
import type { ContextPage } from '@utils/types';

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
    // if (context.parameters.)
    //   this.store.dispatch(setEntityId(context.parameters.contactId.raw));
    // if (
    //   context.parameters.WPNId.raw &&
    //   context.parameters.WPNId.raw !== "val"
    // )
    //   this.store.dispatch(setUserSiteId(context.parameters.siteId.raw));
    const templateMode = context.parameters.TemplateMode.raw;
    this.store.dispatch(setTemplateMode(templateMode));

    return createElement(
      Provider,
      { store: this.store } as ProviderProps,
      createElement(FluentProvider, { theme: webLightTheme, style: { width: '100%' } }, createElement(App)),
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {}
}
