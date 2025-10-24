'use client';
import useGlobalStore from '@/stores/useGlobalStore';
import 'client-only';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function useAuthorization(userTypes: string[]) {
  const { status } = useSession();
  const { userInfo } = useGlobalStore();

  //null means loading
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsAuthorized(false);
    } else if (status === 'authenticated') {
      setIsAuthorized(
        userTypes.findIndex(
          (userType) => userType.toLocaleUpperCase() === userInfo?.type?.toLocaleUpperCase(),
        ) > -1,
      );
    }
  }, [userInfo, status]);

  return { isAuthorized };
}

export default useAuthorization;
