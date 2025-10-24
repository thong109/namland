import { OpenAPI } from '@/ecom-sadec-api-client/core/OpenAPI';
import AuthConstant from '@/libs/constants/authConstant';
import { languageList } from '@/libs/constants/languageConstant';
import useCoreAppConfigStore from '@/stores/states/CoreAppConfigStore';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getSession, signOut } from 'next-auth/react';
import qs from 'qs';

const isServer = typeof window === 'undefined';
let baseURL = OpenAPI.BASE;
if (isServer) {
  baseURL = OpenAPI.BASE;
} else if (useCoreAppConfigStore.getState().config) {
  baseURL = useCoreAppConfigStore.getState().config.backEndApiUrl;
}
const apiClient = axios.create({
  baseURL,
  paramsSerializer: function (params) {
    return qs.stringify(params, {
      encode: params.keyword?.includes('#'),
    });
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearAccessTokenCookie = async () => {
  Cookies.remove(AuthConstant.AccessTokenCookieName);
};

const clearAuthLocalStorage = () => {
  localStorage.removeItem(AuthConstant.LocalStorageAuthKey);
};

const getTokenFromSession = async (): Promise<string> => {
  const session = await getSession();
  if (session && session['accessToken']) {
    return session['accessToken'];
  } else {
    // to prevent fetching to many session requests
    // this will reset after new login
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    setCookie(AuthConstant.AccessTokenCookieName, 'fake_token', expiredDate);
    return null;
  }
};

const getCookie = async (name: string): Promise<string> => {
  if (!isServer) {
    return Cookies.get(name);
  } else {
    const { cookies } = await import('next/headers');
    return cookies().get(AuthConstant.AccessTokenCookieName)?.value;
  }
};

const setCookie = (name: string, value: string, expiredDate: Date) => {
  if (!isServer) {
    Cookies.set(name, value, {
      expires: expiredDate,
    });
  }
};

export const getAccessToken = async (): Promise<string> => {
  let token = await getCookie(AuthConstant.AccessTokenCookieName);
  if (!token || token === 'null') {
    token = await getTokenFromSession();
    if (token) {
      const expiredDate = new Date();
      expiredDate.setMinutes(expiredDate.getMinutes() + 30);
      setCookie(AuthConstant.AccessTokenCookieName, token, expiredDate);
    }
  }

  return token;
};

const getAppCultureHeader = async (): Promise<string> => {
  let cultrue = Cookies.get('NEXT_LOCALE') ?? 'vi';

  if (!isServer) {
    cultrue = Cookies.get('NEXT_LOCALE');
  } else {
    const { cookies } = await import('next/headers');
    cultrue = cookies().get('NEXT_LOCALE')?.value;
  }
  return cultrue;
};

apiClient.interceptors.request.use(async (config?: any) => {
  const culture = await getAppCultureHeader();
  config.headers = {
    ...config.headers,
    'App.Culture': culture ?? 'vi',
  };

  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
});

const handleSuccess = (response: any) => {
  return response;
};

const handleUnauthorizedRedirect = () => {
  let pathToRedirect = '/';

  const adminIndex = window.location.pathname.indexOf('/admin');
  if (adminIndex > -1) {
    pathToRedirect = '/account/login-admin';
  }

  let locale = '';
  languageList.forEach((lang) => {
    if (window.location.pathname.indexOf(`/${lang}`) === 0) {
      locale = lang;
    }
  });

  window.location.href = `${locale}${pathToRedirect}`;
};

const handleError = async (error: any) => {
  switch (error.response && error.response.status) {
    case 401:
      if (!isServer) {
        try {
          const session = await getSession();
          if (session) {
            await signOut({ redirect: false });
          }
        } finally {
          clearAuthLocalStorage();
          await clearAccessTokenCookie();
          handleUnauthorizedRedirect();
        }
      }
      break;
    case 404:
      break;
    case 400:
    case 500:
      break;
    default:
      break;
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
