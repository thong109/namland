import {
  getEcomEcomAccountMe,
  getEcomEcomListingMemberPackageGetMemberPackageProfile,
} from '@/ecom-sadec-api-client';
import AuthConstant from '@/libs/constants/authConstant';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useCallback, useMemo } from 'react';
import useGlobalStore from './useGlobalStore';

export type AuthStatus = 'authenticated' | 'unauthenticated';

export const useAuthStore = () => {
  const { token, setToken, setUserInfo, setUserPackage, userInfo } = useGlobalStore();

  const status: AuthStatus = useMemo(() => (token ? 'authenticated' : 'unauthenticated'), [token]);

  const verifyTokenIsStillValid = useCallback(async () => {
    if (status === 'authenticated') {
      try {
        const response = await getEcomEcomAccountMe({ authorization: null });

        if ((response as any)?.success !== true) {
          throw 'Token is invalid';
        } else {
          setCookie(token);
          setUserInfo((response as any)?.data);
        }

        const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
          authorization: null,
        });

        if ((response as any)?.success !== true) {
          throw 'Token is invalid';
        } else {
          setUserPackage((resUserPackage as any)?.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [status, token]);

  const setCookie = (token) => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    Cookies.set(AuthConstant.AccessTokenCookieName, token, {
      expires: expiredDate,
    });
  };

  useQuery({
    queryKey: ['verifyTokenIsStillValid'],
    queryFn: verifyTokenIsStillValid,
    enabled: status === 'authenticated',
  });

  return {
    userInfo,
    status,
    token,
    setToken,
  };
};
