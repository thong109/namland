import logoHT from '@/assets/images/common/favicon.ico';
import Footer from '@/components/Footer/Footer';
import SiteHeader from '@/components/Header/SiteHeader';
import AcceptCookies from '@/components/PopupAcceptCookies';
import '@/fonts/line-awesome-1.3.0/css/line-awesome.css';
import { primaryColor } from '@/libs/appconst';
import { API_URL } from '@/libs/constants/commonConstant';
import '@/styles/index.scss';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ConfigProvider } from 'antd';
import enLocale from 'antd/locale/en_US';
import krLocale from 'antd/locale/ko_KR';
import viLocale from 'antd/locale/vi_VN';
import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import 'rc-slider/assets/index.css';
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ClientCommons from './ClientCommons';
import ClientPageContainer from './clientPageContainer';
import './globals.css';
import ToastProvider from './toastProvider';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return ['en', 'vi', 'ko'].map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t('LocaleLayout.title'),
    icons: [{ rel: 'icon', url: logoHT.src }],
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = await getMessages(locale);

  let currentLocaleObj = viLocale;
  switch (locale) {
    case 'vi':
      currentLocaleObj = viLocale;
      break;
    case 'en':
      currentLocaleObj = enLocale;
      break;
    case 'kr':
      currentLocaleObj = krLocale;
      break;
    default:
      currentLocaleObj = viLocale;
      break;
  }

  const preconnectUrl = API_URL + 'health';

  const coreAppConfig = {
    backEndApiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,

    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

    urlSocket: process.env.NEXT_PUBLIC_URL_SOCKET,
  };

  return (
    <html lang={locale}>
      <body>
        <link rel="preconnect" href={preconnectUrl} />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ConfigProvider
            locale={currentLocaleObj}
            theme={{
              token: {
                colorPrimary: primaryColor,
              },
            }}
          >
            <ToastProvider>
              <AcceptCookies />
              <ClientCommons />

              <SiteHeader />
              <main>
                <NextTopLoader crawl={true} showSpinner={false} />
                <ClientPageContainer coreAppConfig={coreAppConfig}>
                  <AntdRegistry>{children}</AntdRegistry>
                </ClientPageContainer>
              </main>

              <Footer />
            </ToastProvider>
          </ConfigProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-DR91697NMB" />
    </html>
  );
}
