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
echo "Running command: pac pcf init -ns \"$NAMESPACE\" -n \"$CONTROL_NAME\" -t \"$TEMPLATE\" -npm -fw react"
if ! pac pcf init -ns "$NAMESPACE" -n "$CONTROL_NAME" -t "$TEMPLATE" -npm -fw react 2>&1 | tee init.log; then
  echo "Failed to initialize the PCF control. Please check the logs for more details."
  cat init.log
  exit 1
fi


# Configure Biome
npx @biomejs/biome init

# Update biome.json
cat <<EOL > biome.json
{
  "files": {
    "ignore": ["node_modules"]
  },
  "formatter": {
    "ignore": ["node_modules"]
  },
  "linter": {
    "rules": {
      "recommended": true
    }
  }
}
EOL





# Navigate to the project directory
cd "$CONTROL_NAME" || exit

# Install necessary dependencies
npm install @fluentui/react@^8.68.2 @fluentui/react-components@^9.46.2 @reduxjs/toolkit@^2.5.0 lodash@^4.17.21 react-redux@^8.0.1 uuid@^8.3.2
npm install --save-dev ajv @biomejs/biome @types/lodash @types/react-redux @types/redux @types/redux-immutable-state-invariant @types/redux-thunk @types/uuid @types/xrm globals pcf-scripts pcf-start redux-devtools-extension 



# Create recommended folder structure
mkdir -p src/components/elements src/components/layout src/hooks src/store/api src/store/app src/utils src/css src/types



# Create index.ts in the store folder
cat <<EOL > src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import pcfContextReducer from './app/context-slice';
import { notes } from './api/notes-api-slice';
export const store = configureStore({
  reducer: {
    pcfApi: pcfContextReducer,
    [notes.reducerPath]: notes.reducer,
  },

  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(notes.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


EOL

# Create a basic context slice
cat <<EOL > src/store/app/context-slice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IInputs } from '../../../generated/ManifestTypes';
import type { IPage } from '../../types/page';

interface IPCFContext {
  context: ComponentFramework.Context<IInputs> | undefined;
  baseUrl: string;
}

const initialState: IPCFContext = {
  context: undefined,
  baseUrl: '',
};

const pcfContextSlice = createSlice({
  name: 'pcfContext',
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<ComponentFramework.Context<IInputs>>) => {
      const { payload } = action;
      const { page } = payload as unknown as { page: IPage };

      state.context = payload;
      try {
      state.baseUrl = (page as IPage).getClientUrl();
      } catch (error) {
        console.error('Error getting base URL', error);
      }


    },

  },
});

export const { setContext } = pcfContextSlice.actions;

export default pcfContextSlice.reducer;


EOL

# Create a basic API slice
cat <<EOL > src/store/api/notes-api-slice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import type { INote } from '../../types/note';

// const baseUrl = Xrm.Utility.getGlobalContext().getClientUrl() + '/api/data/v9.2';

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // Get the base URL from the Redux state
  const baseUrl = (api.getState() as RootState).pcfApi.baseUrl;

  console.log('🚀 ~ dynamicBaseQuery ~ baseUrl:', api.getState());

  if (!baseUrl) {
    // Return an error if the base URL is not set
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'Base URL is not set in the state.',
      },
    };
  }

  // Adjust the args to include the base URL
  const adjustedArgs =
    typeof args === 'string'
      ? { url: baseUrl + args } // If `args` is a string, prepend the base URL
      : { ...args, url: baseUrl + args.url }; // If `args` is an object, adjust the `url` field

  console.log('🚀 ~ constdynamicBaseQuery ~ adjustedArgs:', adjustedArgs);
  // Use  with the adjusted arguments
  const baseQuery = fetchBaseQuery({ baseUrl });
  return baseQuery(adjustedArgs, api, extraOptions);
};

export const notes = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: builder => ({
    getNotes: builder.query<INote[], void>({
      query: () => '/api/data/v9.2/annotations?=annotationid,documentbody,filename,filesize',
    }),

    createBooking: builder.mutation<INote, Omit<INote, 'annotationId'>>({
      query: post => ({
        url: '/api/data/v9.2/annotations',
        method: 'POST',
        body: post,
      }),
    }),
  }),
});

export const { useGetNotesQuery } = notes;

EOL

# Create the main App component
cat <<EOL > ./app.tsx
import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { Provider } from 'react-redux';
import { store } from './src/store';
import CustomComponent from './src/components/CustomComponent';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  console.log('🚀 ~ context:', context);
  return (
    <Provider store={store}>
      <CustomComponent context={context} />
    </Provider>
  );
};
EOL

# Create a custom component
cat <<EOL > src/components/CustomComponent.tsx
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContext } from '../store/app/context-slice';
import { useGetNotesQuery } from '../store/api/notes-api-slice';
import type { AppDispatch, RootState } from '../store';
import { IInputs } from '../../generated/ManifestTypes';

interface ICustomComponent {
  context: ComponentFramework.Context<IInputs>;
}

const CustomComponent = ({ context }: ICustomComponent) => {
  const dispatch = useDispatch<AppDispatch>();
  const ctx = useSelector((state: RootState) => state.pcfApi.context);
  const { data: notes, isLoading } = useGetNotesQuery();

  React.useEffect(() => {
    dispatch(setContext(context));
  }, [dispatch, context]);

  if (!ctx || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes?.map(note => (
          <li key={note.annotationid}>{note.filename}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomComponent;

EOL



# Create types
cat <<EOL > src/types/note.ts
export interface INote {
  annotationid: string;
  documentbody: string;
  filename: string;
  filesize: number;
}
EOL

cat <<EOL > src/types/page.ts
export interface IPage {
  appId: string;
  entityTypeName: string;
  entityId: string;
  isPageReadOnly: boolean;
  getClientUrl: () => string;
}

EOL

# Create a basic CSS file

cat <<EOL > src/css/index.css
/* Add your styles here */
EOL

# Update the manifest file to include the CSS
sed -i '/<resources>/a \ \ <css path="src/css/index.css" />' ControlManifest.Input.xml

# remove the helloWorld file
rm ./helloWorld.tsx


# Update references to the HelloWorld component in index.ts
cat <<EOL > index.ts
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { App, IAppProps } from './app';
import * as React from 'react';


export class ${CONTROL_NAME} implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private context: ComponentFramework.Context<IInputs>;
 
  constructor() {}


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
EOL





# Update references to the HelloWorld component in index.ts
sed -i "s/import { HelloWorld, IHelloWorldProps } from '.\/HelloWorld';/import { App, IAppProps } from '.\/App';/" index.ts

echo "PCF control '$CONTROL_NAME' created successfully with the specified structure."