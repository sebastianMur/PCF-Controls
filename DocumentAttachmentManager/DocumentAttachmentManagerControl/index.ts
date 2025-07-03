/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import type { IAppProps } from './app';
import { App } from './app';
import type { IInputs, IOutputs } from './generated/ManifestTypes';
import { Disabled } from './src/components/error-boundary/disabled';

export class DocumentAttachmentManagerControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;

  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    this.context = context;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const { page } = this.context as unknown as any;

    if (page.entityId) {
      const props: IAppProps = {
        context: this.context,
      };

      return React.createElement(App, props);
    }

    return React.createElement(Disabled, {});
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
