export interface IPage {
  appId: string;
  entityTypeName: string;
  entityId: string;
  isPageReadOnly: boolean;
  getClientUrl: () => string;
}

