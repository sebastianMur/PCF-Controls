## Creating a Virtual PCF

### Command

Run the following command to initialize a new PCF control:

```bash
pac pcf init -ns <Namespace> -n <ControlName> -t <ControlType> -npm -fw react
```

### Parameters

- **Namespace**: Replace `<Namespace>` with your desired namespace (e.g., `SampleNamespace`).
- **ControlName**: Replace `<ControlName>` with the name of your control (e.g., `VirtualControl`).
- **ControlType**: Use `Field` for single field components or `Dataset` for components bound to datasets.

---

## Installation

Ensure you have the necessary dependencies installed for development. To install the required libraries, run:

```bash
npm install @fluentui/react @material-ui/core @material-ui/icons lodash uuid react-redux @reduxjs/toolkit
npm install --save-dev ajv @biomejs/biome @types/lodash @types/react-redux @types/redux @types/redux-immutable-state-invariant @types/redux-thunk @types/uuid @types/xrm globals pcf-scripts pcf-start redux-devtools-extension
```

---

## Recommended Folder Structure

Below is a recommended structure for organizing your PCF project:

```plaintext
📁 src
├── 📁 components      # Reusable React components
│   ├── 📁 elements    # UI elements like buttons, inputs
│   └── 📁 layout      # Layout-specific components
├── 📁 hooks           # Custom React hooks
├── 📁 store           # Redux store and slices
│   ├── 📁 api         # API logic with RTK Query
│   └── 📁 app         # Global app states
├── 📁 utils           # Utility functions and helpers
├── 📁 css             # Stylesheets
├── 📁 types           # TypeScript types and interfaces

```

---

## Configuration

### CSS

Create a file in the `css` folder and reference that file in the manifest:

```xml
<resources>
  <code path="index.ts" order="1" />
  <!-- This is the file that allows CSS styles in your PCF control -->
  <css path="css/index.css" />
</resources>
```

### Using Biome

Create a file with this command:

```bash
npx @biomejs/biome init
```

Change the `__NameOfProject` in the biome.json with the parent folder name of the `src` folder .

### Configure RTK Query

Create a file for a slice in `api-states` (example: for notes in D365):

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const baseUrl = (api.getState() as RootState).pcfApi.baseUrl;

  if (!baseUrl) {
    return { error: { status: 400, statusText: 'Bad Request', data: 'Base URL is not set.' } };
  }

  const adjustedArgs = typeof args === 'string' ? { url: `${baseUrl}${args}` } : { ...args, url: `${baseUrl}${args.url}` };

  const baseQuery = fetchBaseQuery({ baseUrl });
  return baseQuery(adjustedArgs, api, extraOptions);
};

export const api = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: builder => ({
    getItems: builder.query<any, void>({
      query: () => '/api/data/v9.2/items?$select=name,id',
    }),
  }),
});

export const { useGetItemsQuery } = api;
```

### Redux Toolkit

```ts : Create a context-slice.ts file in src/store/app-states
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContextState {
  context: ComponentFramework.Context<IInputs> | null;
}

const initialState: ContextState = {
  context: null,
};

const contextSlice = createSlice({
  name: 'pcfContext',
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<ComponentFramework.Context<IInputs>>) => {
      state.context = action.payload;
    },
  },
});

export const { setContext } = contextSlice.actions;
export default contextSlice.reducer;
```

### Combining Redux Toolkit and RTK Query

Create the Redux store in store/index.ts:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import pcfContextReducer from './app-states/pcf-context-slice';
import { api } from './api-states/api-slice';

export const store = configureStore({
  reducer: {
    pcfApi: pcfContextReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Using Redux Toolkit in a Component

To use Redux Toolkit and RTK Query in a component, follow these steps:

1. **Wrap your application with the Redux Provider**:

```typescript
import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import type { IInputs } from './generated/ManifestTypes';
import CustomComponent from './components/questionnaire-designer';

export interface IAppProps {
  context: ComponentFramework.Context<IInputs>;
}

export const App = ({ context }: IAppProps) => {
  return (
    <Provider store={store}>
      <CustomComponent context={context} />
    </Provider>
  );
};
```

2. **Use the Redux hooks in your component**:

```typescript
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { IInputs } from '../../generated/ManifestTypes';
import { setContext } from '../../store/app-states/pcf-context-slice';
import { useGetNotesQuery } from '../../store/api-states/notes-api-slice';
import type { AppDispatch, RootState } from '../../store';

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
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomComponent;
```

### Fluent UI: Example using FluentUI

```js
import { PrimaryButton } from '@fluentui/react';

const App = () => <PrimaryButton onClick={() => console.log('Button clicked!')}>Click Me</PrimaryButton>;

export default App;
```

---

## Using XRMToolbox (Dataverse REST Builder)

Use the **Dataverse REST Builder** plugin in XRMToolbox to explore and generate API requests for your Dataverse environment. This tool can help you quickly create queries and test them before integrating them into your PCF component.

---

## Helpful Links

- [Official PCF Documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview)
- [Dataverse REST Builder Plugin](https://www.xrmtoolbox.com/plugins/Dynamics365.RESTBuilder/)
- [Fluent UI Documentation](https://developer.microsoft.com/en-us/fluentui#/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/introduction/getting-started)
- [YouTube Tutorial for PCF](https://www.youtube.com/watch?v=MYVmXdANC08&t=322s)
- [Redux - Complete Tutorial (with Redux Toolkit)](https://www.youtube.com/watch?v=5yEG6GhoJBs)
- [RTK Query in React](https://www.youtube.com/watch?v=NGdUPRFQXYg)
- [Biome Getting Started Guide](https://biomejs.dev/guides/getting-started/)
