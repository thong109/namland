'use client';
import SliderBarPortal from '@/components/SliderBarPortal/SliderBarPortal';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { usePathname } from 'next-intl/client';
import { useEffect } from 'react';
import './style.scss';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useGlobalStore();
  const pathName = usePathname();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    if (typeof window !== 'undefined') {
      // Check if window is defined
      // Perform window-dependent actions here
      // For example:
      const isClientSide = !!(window && window.document && window.document.createElement);
      if (isClientSide) {
        if (!userInfo && pathName.startsWith('/client')) {
          // push('/');
          return false;
        }
        if (!userInfo && pathName.startsWith('/admin')) {
          // push('/account/login-admin');
          return false;
        }

        if (
          userInfo &&
          userInfo.type === UserTypeConstant.Customer &&
          pathName.startsWith('/client')
        ) {
          return children;
        }
        if (
          userInfo &&
          userInfo.type === UserTypeConstant.Salesman &&
          pathName.startsWith('/admin')
        ) {
          return children;
        }

        if (userInfo && pathName.startsWith('/my-profile')) {
          return children;
        }
        if (userInfo && pathName.startsWith('/thanh-toan-online')) {
          return children;
        }
      }
    }
  };

  return (
    <div className="background-admin">
      <div className="container flex gap-x-5 bg-transparent text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <div className="hidden lg:flex lg:w-[20%]">
          {!pathName.startsWith('/thanh-toan-online') && <SliderBarPortal />}
        </div>
        <div className="w-full overflow-x-hidden bg-transparent lg:w-[80%]">
          {/* Render the result of checkLogin directly */}
          {checkLogin()}
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
