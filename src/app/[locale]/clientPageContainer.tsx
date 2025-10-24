'use client';

import FacebookPixel from '@/components/FacebookPixel';
import useCoreAppConfigStore, { CoreAppConfig } from '@/stores/states/CoreAppConfigStore';
import { FC, useEffect } from 'react';

const ClientPageContainer: FC<{ children: any; coreAppConfig: CoreAppConfig }> = ({
  children,
  coreAppConfig,
}) => {
  const { config, setConfig } = useCoreAppConfigStore();

  useEffect(() => {
    if (!config) {
      setConfig(coreAppConfig);
    }
  }, [config, setConfig]);

  if (!config) {
    return (
      <div className="h-fit min-h-[90vh] w-screen">
        <section className="bg-white dark:bg-gray-900">
          <div className="container mx-auto animate-pulse px-6 py-10">
            <h1 className="mx-auto h-2 w-48 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>

            <p className="mx-auto mt-4 h-2 w-64 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
            <p className="mx-auto mt-4 h-2 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 sm:w-80"></p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:mt-12 xl:grid-cols-4 xl:gap-12">
              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>

              <div className="w-full">
                <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="mt-4 h-2 w-56 rounded-lg bg-gray-200 dark:bg-gray-700"></h1>
                <p className="mt-4 h-2 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {children}
      <FacebookPixel />
    </>
  );
};

export default ClientPageContainer;
