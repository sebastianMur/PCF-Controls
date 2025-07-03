#!/bin/bash

# Prompt the user for the control name and namespace
read -p "Enter the Namespace: " NAMESPACE
read -p "Enter the Control Name: " CONTROL_NAME

# Prompt the user to select the template
echo "Select the template to create the PCF control:"
options=("Field" "Dataset")
PS3="Please select the template (1 or 2): "
select TEMPLATE in "${options[@]}"; do
  case $TEMPLATE in
    "Field"|"Dataset")
      echo "You selected $TEMPLATE template."
      break
      ;;
    *)
      echo "Invalid option. Please select 1 or 2."
      ;;
  esac
done

# Print the entered values
echo "Control Name: $CONTROL_NAME"
echo "Namespace: $NAMESPACE"
echo "Template: $TEMPLATE"



mkdir -p "$NAMESPACE"

# Navigate to the project directory
if ! cd "$NAMESPACE"; then
  echo "Failed to navigate to the project directory. Directory '$NAMESPACE' does not exist."
  exit 1
fi

# Initialize the PCF control
# Initialize the PCF control
echo "Running command: pac pcf init -ns \"$NAMESPACE\" -n \"$CONTROL_NAME\" -t \"$TEMPLATE\" -fw react"
if ! pac pcf init -ns "$NAMESPACE" -n "$CONTROL_NAME" -t "$TEMPLATE" -fw react 2>&1 | tee init.log; then
  echo "Failed to initialize the PCF control. Please check the logs for more details."
  cat init.log
  exit 1
fi

# Create package.json
cat <<EOL > package.json
{
  "name": "pcf-project",
  "version": "1.0.0",
  "description": "Project containing your PowerApps Component Framework (PCF) control.",
  "scripts": {
    "build": "pcf-scripts build",
    "clean": "pcf-scripts clean",
    "lint": "biome check $CONTROL_NAME",
    "format": "biome check --write $CONTROL_NAME",
    "rebuild": "pcf-scripts rebuild",
    "start": "pcf-scripts start",
    "start:watch": "pcf-scripts start watch",
    "refreshTypes": "pcf-scripts refreshTypes"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.5.0",
    "react-redux": "^8.1.3"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@fluentui/react-components": "9.46.2",
    "@types/powerapps-component-framework": "^1.3.15",
    "@types/react": "^16.14.60",
    "@types/react-dom": "^16.9.24",
    "eslint": "^9.20.1",
    "globals": "^15.13.0",
    "pcf-scripts": "^1",
    "pcf-start": "^1",
    "react": "^16.14.0",
    "react-dom": "16.14.0",
    "typescript": "^5.7.3",
  }
}
EOL

# Install necessary dependencies
npm install



# Configure Biome
npx @biomejs/biome init

# Update biome.json
cat <<EOL > biome.json
{
  " \`\$schema\`": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": { "indentStyle": "space", "indentWidth": 2, "lineWidth": 80, "lineEnding": "lf" },
  "javascript": { "formatter": { "arrowParentheses": "asNeeded" } },
  "organizeImports": { "enabled": true },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "files": { "include": ["$CONTROL_NAME/**/*.ts*"], "ignore": ["out/**/*", "obj/**/*", "node_modules/**/*"] }
}
EOL

# Update eslint.config.mjs
cat <<EOL > eslint.config.mjs
/** @type {import('eslint').Linter.Config[]} */
export default [];
EOL


# Update webpack.config.js
cat <<EOL > webpack.config.js
const path = require('path');
module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '${CONTROL_NAME}/components'),
      '@generated': path.resolve(__dirname, '${CONTROL_NAME}/generated'),
      '@utils': path.resolve(__dirname, '${CONTROL_NAME}/utils'),
    },
  },
};

EOL
# Update tsconfig.json
cat <<EOL > tsconfig.json
{
    "extends": "./node_modules/pcf-scripts/tsconfig_base.json",
    "compilerOptions": {
        "typeRoots": ["node_modules/@types"],
        "strict": true,
        "target": "ES2022",
        "jsx": "react-jsx",
        "module": "esnext",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "noUnusedParameters": true,
        "noUnusedLocals": true,
        "lib": ["ES2022", "DOM"],
        "strictPropertyInitialization": false,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "baseUrl": "./${CONTROL_NAME}",
        "paths": {
            "@components/*": ["./components/*"],
            "@generated/*": ["./generated/*"],
            "@utils/*": ["./utils/*"]
        }
    },
    "exclude": ["./node_modules"]
}
EOL


# Update featureconfig.json
cat <<EOL > featureconfig.json
{
  "pcfAllowCustomWebpack": "on"
}
EOL



EOL
mkdir -p .vscode

# Create settings.json in the .vscode folder
cat <<EOL > ./.vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "always",
    "source.organizeImports.biome": "explicit",
    "quickFix.biome": "always"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}

EOL

# Navigate to the project directory
cd "$CONTROL_NAME" || exit




# Create recommended folder structure
mkdir -p components utils/hooks utils/store utils/types

# Create manifest 
cat <<EOL > ./ControlManifest.Input.xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control namespace="$NAMESPACE" constructor="$CONTROL_NAME" version="0.0.1" display-name-key="$CONTROL_NAME" description-key="$CONTROL_NAME description" control-type="virtual" >
    <external-service-usage enabled="false">
    </external-service-usage>
    <property name="sampleProperty" display-name-key="Property_Display_Key" description-key="Property_Desc_Key" of-type="SingleLine.Text" usage="bound" required="true" />
    <property name="DevelopmentEntityId" display-name-key="DO NOT USE" description-key="Only used for development" of-type="SingleLine.Text" usage="input" required="false" />
    <resources>
      <code path="index.ts" order="1"/>
      <platform-library name="React" version="16.14.0" />
      <platform-library name="Fluent" version="9.46.2" />
    </resources>
    <!-- UNCOMMENT TO ENABLE THE SPECIFIED API
    <feature-usage>
      <uses-feature name="Device.captureAudio" required="true" />
      <uses-feature name="Device.captureImage" required="true" />
      <uses-feature name="Device.captureVideo" required="true" />
      <uses-feature name="Device.getBarcodeValue" required="true" />
      <uses-feature name="Device.getCurrentPosition" required="true" />
      <uses-feature name="Device.pickFile" required="true" />
      <uses-feature name="Utility" required="true" />
      <uses-feature name="WebAPI" required="true" />
    </feature-usage>
    -->
  </control>
</manifest>

EOL


# Create app.tsx in the component folder
cat <<EOL > ./components/app.tsx
import { Text } from "@fluentui/react-components";

import { useGetDataQuery } from "@utils/store/api";
import { ErrorMessage } from "./error";
import { Loading } from "./loading";

export const App = () => {
     const { isLoading, isError } = useGetDataQuery("1");

     if (isLoading) return <Loading />;
     if (isError) return <ErrorMessage />;
     return <Text>App</Text>;
};
EOL

# Create Error.tsx in the component folder
cat <<EOL > components/error.tsx
import { Text } from "@fluentui/react-components";

export const ErrorMessage = () => {
     return <Text>There was an error</Text>;
};
EOL

# Create Loading.tsx in the component folder
cat <<EOL > components/loading.tsx
import { Text } from '@fluentui/react-components';

export const Loading = () => {
  return <Text>Loading...</Text>;
};
EOL

# Create index.tsx in the utils/hooks folder
cat <<EOL > utils/hooks/index.ts
export * from './useAppHooks';
EOL

# Create useAppHooks.tsx in the utils/hooks folder
cat <<EOL > utils/hooks/useAppHooks.tsx
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import { AppDispatch } from '../store';
import type { RootState } from '../store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

EOL

# Create index.ts in the utils/store folder
cat <<EOL > utils/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import { api } from './api';
import { contextSlice } from './context-slice';

export const store = configureStore({
  reducer: {
    context: contextSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './context-slice';

EOL

# Create api.ts in the utils/store folder
cat <<EOL > utils/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { selectBaseUrl } from '.';
import type { RootState } from '.';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: ((args, store, extraOptions) =>
    fetchBaseQuery({
      baseUrl: \`\${selectBaseUrl(store.getState() as RootState)}/api/data/v9.2\`,
    })(args, store, extraOptions)) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  endpoints: builder => ({
    getData: builder.query<string, string>({
      query: id => \`/entity(\${id})\`,
    }),
  }),
});

export const { useGetDataQuery } = api;

EOL

# Create context-slice.ts in the utils/store folder
cat <<EOL > utils/store/context-slice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '.';

export const contextSlice = createSlice({
  name: 'context',
  initialState: { baseUrl: '', entityId: ''  },
  reducers: {
    setEntityId: (state, { payload }: PayloadAction<string>) => {
      state.entityId = payload;
    },
    setBaseUrl: (state, { payload }: PayloadAction<string>) => {
      state.baseUrl = payload;
    },

  },
});

export const selectEntityId = (state: RootState) => state.context.entityId;
export const selectBaseUrl = (state: RootState) => state.context.baseUrl;

export const { setEntityId, setBaseUrl } = contextSlice.actions;

EOL

# Create index.ts in the utils/types folder
cat <<EOL > utils/types/index.ts

export * from './PCFContext';

EOL

# Create index.ts in the utils/types folder
cat <<EOL > utils/types/PCFContext.ts

export type ContextPage = { page: { getClientUrl: () => string } };

EOL


# remove the helloWorld file
rm ./helloWorld.tsx


# Update main index.ts
cat <<EOL > index.ts
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import type { IInputs, IOutputs } from '@generated/ManifestTypes';
import type { ContextPage } from '@utils/types';
import {  setBaseUrl, setEntityId, createStore } from '@utils/store';
import { App } from '@components/app';


export class ${CONTROL_NAME} implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private store: ReturnType<typeof createStore>;

  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  constructor() {}

  private initializeStore(context: ComponentFramework.Context<IInputs>): void {
    const store = createStore();

    this.store = store;

    const { page } = context as unknown as ContextPage;

    if (context.parameters.DevelopmentEntityId.raw) {
      store.dispatch(setEntityId(context.parameters.DevelopmentEntityId.raw));
      store.dispatch(setBaseUrl('http://localhost:3030'));
    } else {
      store.dispatch(setEntityId(page.entityId));
      store.dispatch(setBaseUrl(page.getClientUrl()));
    }

  }


  public init(context: ComponentFramework.Context<IInputs>): void {
    this.initializeStore(context);
  }

  public updateView(): ReactElement {
    return createElement(
      Provider,
      { store: this.store } as ProviderProps,
      createElement(
        FluentProvider,
        { theme: webLightTheme, style: { width: '100%' } },
        createElement(App)
      )
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  public destroy(): void {}
  }
EOL