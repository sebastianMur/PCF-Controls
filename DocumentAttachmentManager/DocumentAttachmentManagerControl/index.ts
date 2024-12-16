import type { IInputs, IOutputs } from './generated/ManifestTypes';
import type { IAppProps } from './app';
import { App } from './app';
import * as React from 'react';

export class DocumentAttachmentManagerControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;

  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    this.context = context;
    const props: IAppProps = {
      context: this.context,
    };

    return React.createElement(App, props);
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
