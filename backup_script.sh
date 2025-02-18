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
    "lint": "pcf-scripts lint",
    "lint:fix": "pcf-scripts lint fix",
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
    "@eslint/js": "^9.17.0",
    "@fluentui/react-components": "9.46.2",
    "@microsoft/eslint-plugin-power-apps": "^0.2.51",
    "@types/powerapps-component-framework": "^1.3.15",
    "@types/react": "^16.14.60",
    "@types/react-dom": "^16.9.24",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-promise": "^7.1.0",
    "eslint-plugin-react": "^7.37.2",
    "globals": "^15.13.0",
    "pcf-scripts": "^1",
    "pcf-start": "^1",
    "prettier": "^3.4.2",
    "react": "^16.14.0",
    "react-dom": "16.14.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.18.1"
  }
}
EOL

# Install necessary dependencies
npm install



# Configure Biome
npx @biomejs/biome init

# Update biome.json
cat <<EOL > biome.json
# Update biome.json
cat <<EOL > biome.json
{
	"files": { "ignore": ["node_modules"] },
	"formatter": { "ignore": ["node_modules"] },
	"linter": {
		"rules": {
			"recommended": false,
			"a11y": { "noBlankTarget": "error" },
			"complexity": {
				"noExtraBooleanCast": "error",
				"noMultipleSpacesInRegularExpressionLiterals": "error",
				"noUselessCatch": "error",
				"noUselessTypeConstraint": "error",
				"noWith": "error",
				"useLiteralKeys": "error",
				"useOptionalChain": "error"
			},
			"correctness": {
				"noChildrenProp": "error",
				"noConstAssign": "error",
				"noConstantCondition": "error",
				"noEmptyCharacterClassInRegex": "error",
				"noEmptyPattern": "error",
				"noGlobalObjectCalls": "error",
				"noInvalidBuiltinInstantiation": "error",
				"noInvalidConstructorSuper": "error",
				"noNonoctalDecimalEscape": "error",
				"noPrecisionLoss": "error",
				"noSelfAssign": "error",
				"noSetterReturn": "error",
				"noSwitchDeclarations": "error",
				"noUndeclaredVariables": "error",
				"noUnreachable": "error",
				"noUnreachableSuper": "error",
				"noUnsafeFinally": "error",
				"noUnsafeOptionalChaining": "error",
				"noUnusedLabels": "error",
				"noUnusedPrivateClassMembers": "error",
				"noUnusedVariables": "error",
				"useArrayLiterals": "off",
				"useIsNan": "error",
				"useJsxKeyInIterable": "error",
				"useValidForDirection": "error",
				"useYield": "error"
			},
			"security": { "noDangerouslySetInnerHtmlWithChildren": "error" },
			"style": {
				"noInferrableTypes": "error",
				"noNamespace": "error",
				"useAsConstAssertion": "error",
				"useConsistentArrayType": "error",
				"useForOf": "error",
				"useShorthandFunctionType": "error"
			},
			"suspicious": {
				"noAsyncPromiseExecutor": "error",
				"noCatchAssign": "error",
				"noClassAssign": "error",
				"noCommentText": "error",
				"noCompareNegZero": "error",
				"noControlCharactersInRegex": "error",
				"noDebugger": "error",
				"noDuplicateCase": "error",
				"noDuplicateClassMembers": "error",
				"noDuplicateJsxProps": "error",
				"noDuplicateObjectKeys": "error",
				"noDuplicateParameters": "error",
				"noEmptyBlockStatements": "error",
				"noExplicitAny": "error",
				"noExtraNonNullAssertion": "error",
				"noFallthroughSwitchClause": "error",
				"noFunctionAssign": "error",
				"noGlobalAssign": "error",
				"noImportAssign": "error",
				"noMisleadingCharacterClass": "error",
				"noMisleadingInstantiator": "error",
				"noPrototypeBuiltins": "error",
				"noRedeclare": "error",
				"noShadowRestrictedNames": "error",
				"noSparseArray": "error",
				"noUnsafeDeclarationMerging": "error",
				"noUnsafeNegation": "error",
				"useAwait": "error",
				"useGetterReturn": "error",
				"useNamespaceKeyword": "error",
				"useValidTypeof": "error"
			}
		},
		"ignore": ["**/generated"]
	},
	"javascript": {
		"globals": [
			"onscrollend",
			"onpointerleave",
			"oncontextrestored",
			"onemptied",
			"ongamepaddisconnected",
			"onkeypress",
			"onloadeddata",
			"onmouseup",
			"onvolumechange",
			"onpaste",
			"onstorage",
			"onkeyup",
			"onabort",
			"oncut",
			"ontransitionrun",
			"onafterprint",
			"onblur",
			"ondurationchange",
			"ontransitionstart",
			"oncanplaythrough",
			"onanimationend",
			"onmouseleave",
			"ondragleave",
			"onplay",
			"onunhandledrejection",
			"onbeforeprint",
			"onpointercancel",
			"onsubmit",
			"ondragstart",
			"onmessage",
			"location",
			"onoffline",
			"onappinstalled",
			"onwheel",
			"onended",
			"onkeydown",
			"onclick",
			"onfocus",
			"onscroll",
			"ongamepadconnected",
			"oncanplay",
			"ComponentFramework",
			"onpointerdown",
			"ondeviceorientationabsolute",
			"onauxclick",
			"ondevicemotion",
			"onratechange",
			"ontransitionend",
			"onscrollsnapchanging",
			"onchange",
			"onselect",
			"onbeforeinstallprompt",
			"onbeforetoggle",
			"onmouseout",
			"ontimeupdate",
			"ondragover",
			"oncuechange",
			"ontransitioncancel",
			"onprogress",
			"onbeforeinput",
			"onpointerenter",
			"onmouseenter",
			"oninvalid",
			"onpointerout",
			"onpagereveal",
			"onpause",
			"onanimationstart",
			"onwaiting",
			"onscrollsnapchange",
			"ondeviceorientation",
			"onclose",
			"onbeforeunload",
			"oncancel",
			"onseeked",
			"onpointerover",
			"ongotpointercapture",
			"onloadedmetadata",
			"onpageshow",
			"onstalled",
			"oncontextmenu",
			"onreset",
			"ondrag",
			"onbeforematch",
			"onload",
			"onlostpointercapture",
			"onsuspend",
			"onselectionchange",
			"onpagehide",
			"onrejectionhandled",
			"onunload",
			"onanimationcancel",
			"onmousedown",
			"onpointerup",
			"onmouseover",
			"onformdata",
			"oncontentvisibilityautostatechange",
			"onresize",
			"onsearch",
			"ontoggle",
			"onpageswap",
			"onbeforexrselect",
			"onlanguagechange",
			"ondragenter",
			"onerror",
			"onpointermove",
			"onmousemove",
			"ondrop",
			"onhashchange",
			"onsecuritypolicyviolation",
			"onslotchange",
			"oncopy",
			"onanimationiteration",
			"ondblclick",
			"ondragend",
			"onpointerrawupdate",
			"onpopstate",
			"onplaying",
			"oncontextlost",
			"onloadstart",
			"onseeking",
			"oninput",
			"onmessageerror",
			"onselectstart",
			"onmousewheel",
			"ononline"
		]
	},
	"overrides": [
		{
			"include": ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
			"linter": {
				"rules": {
					"correctness": {
						"noConstAssign": "off",
						"noGlobalObjectCalls": "off",
						"noInvalidBuiltinInstantiation": "off",
						"noInvalidConstructorSuper": "off",
						"noNewSymbol": "off",
						"noSetterReturn": "off",
						"noUndeclaredVariables": "off",
						"noUnreachable": "off",
						"noUnreachableSuper": "off"
					},
					"style": {
						"noArguments": "error",
						"noVar": "error",
						"useConst": "error"
					},
					"suspicious": {
						"noClassAssign": "off",
						"noDuplicateClassMembers": "off",
						"noDuplicateObjectKeys": "off",
						"noDuplicateParameters": "off",
						"noFunctionAssign": "off",
						"noImportAssign": "off",
						"noRedeclare": "off",
						"noUnsafeNegation": "off",
						"useGetterReturn": "off"
					}
				}
			}
		},
		{
			"include": ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
			"linter": {
				"rules": {
					"correctness": {
						"noConstAssign": "off",
						"noGlobalObjectCalls": "off",
						"noInvalidBuiltinInstantiation": "off",
						"noInvalidConstructorSuper": "off",
						"noNewSymbol": "off",
						"noSetterReturn": "off",
						"noUndeclaredVariables": "off",
						"noUnreachable": "off",
						"noUnreachableSuper": "off"
					},
					"style": {
						"noArguments": "error",
						"noVar": "error",
						"useConst": "error"
					},
					"suspicious": {
						"noClassAssign": "off",
						"noDuplicateClassMembers": "off",
						"noDuplicateObjectKeys": "off",
						"noDuplicateParameters": "off",
						"noFunctionAssign": "off",
						"noImportAssign": "off",
						"noRedeclare": "off",
						"noUnsafeNegation": "off",
						"useGetterReturn": "off"
					}
				}
			}
		}
	]
}

EOL
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

# Update prettierrc.json
cat <<EOL > prettierrc.json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "arrowParens": "avoid"
}

EOL


# Navigate to the project directory
cd "$CONTROL_NAME" || exit




# Create recommended folder structure
mkdir -p components utils/hooks utils/store utils/types

# Create app.tsx in the component folder
cat <<EOL > ./components/app.tsx
import { Text } from '@fluentui/react-components';

import { useGetDataQuery } from '@utils/store/api';
import { Loading } from './loading';
import { Error } from './error';

export const App = () => {
  const {  isLoading, isError } = useGetDataQuery('1');

  if (isLoading) return <Loading />
  if (isError) return <Error />
  return <Text>App</Text>
};

EOL

# Create Error.tsx in the component folder
cat <<EOL > components/error.tsx
import { Text } from '@fluentui/react-components';

export const Error = () => {
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
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { IInputs } from '@generated/ManifestTypes';
import type { ContextPage } from '../types';
import type { RootState } from '.';

export const contextSlice = createSlice({
  name: 'context',
  initialState: { baseUrl: '' },
  reducers: {
    initContext: (
      state,
      { payload }: PayloadAction<ComponentFramework.Context<IInputs>>
    ) => {
      try {
        state.baseUrl = (payload as unknown as ContextPage).page.getClientUrl();
      } catch (error) {
        state.baseUrl = 'http://localhost:3030'; // for development
      }
    },
  },
});

export const selectBaseUrl = (state: RootState) => state.context.baseUrl;

export const { initContext } = contextSlice.actions;

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


# Update references to the HelloWorld component in index.ts
cat <<EOL > index.ts
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import type { ProviderProps } from 'react-redux';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import type { IInputs, IOutputs } from '@generated/ManifestTypes';
import { initContext, store } from '@utils/store';
import { App } from '@components/app';


export class ${CONTROL_NAME} implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public init(context: ComponentFramework.Context<IInputs>): void {
    store.dispatch(initContext(context));
  }

  public updateView(): ReactElement {
    return createElement(
      Provider,
      { store } as ProviderProps,
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public destroy(): void {}
EOL