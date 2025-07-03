// import { ErrorMessage } from "./error";
// import { Loading } from "./loading";

import TemplateTabs from "./template-tabs";

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className='text-3xl font-bold text-gray-900 mb-6'>Dynamics 365 Template Builder</h1> */}
        <TemplateTabs />
      </div>
    </div>
  );
};
