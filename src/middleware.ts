import createMiddleware from 'next-intl/middleware';
import { languageList } from './libs/constants/languageConstant';

export default createMiddleware({
  locales: languageList,
  defaultLocale: 'vi',
  localeDetection: false,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|health|_next|_vercel|.*\\..*).*)'],
};
