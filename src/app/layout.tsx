import apiSettingService from '@/apiServices/externalApiServices/apiSettingService';
import '@fortawesome/fontawesome-free/css/all.css';
import { ReactNode } from 'react';
import ClientSideProvider from './clientSideProvider';
import './override-ant-design.scss';
import './style.css';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
  const response = await apiSettingService.getSettingServiceLandingPage();

  return (
    <ClientSideProvider settingLandingPage={response?.data ?? null}>{children}</ClientSideProvider>
  );
}
