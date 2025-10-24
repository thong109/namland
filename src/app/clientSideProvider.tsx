'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { initCookie } from './actions';
import GlobalSettingContextProvider from './globalSettingContextProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientSideProvider({
  children,
  settingLandingPage,
}: {
  children: ReactNode;
  settingLandingPage: any;
}) {
  useEffect(() => {
    initCookie();
  }, []);

  // @ts-ignore
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalSettingContextProvider settingLandingPage={settingLandingPage}>
        <SessionProvider>{children}</SessionProvider>
      </GlobalSettingContextProvider>
    </QueryClientProvider>
  );
}
