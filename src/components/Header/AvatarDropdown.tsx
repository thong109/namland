'use client';
import {
  myFavoriteIcon,
  myFavoriteSelectIcon,
  myProfileIcon,
  myProfileSelectIcon,
  myPropertiesIcon,
  myPropopertiesSelectIcon,
  ticketManagementIcon,
} from '@/libs/appComponents';
import { appPermissions } from '@/libs/appconst';
import AuthConstant from '@/libs/constants/authConstant';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissionModule } from '@/libs/helper';
import Avatar from '@/shared/Avatar';
import useGlobalStore from '@/stores/useGlobalStore';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import React, { Fragment, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import useOnClickOutside from 'use-onclickoutside';
interface Props {
  className?: string;
  displayName?: boolean;
}
const timeoutDuration = 60;
export default function AvatarDropdown({ className = '', displayName }: Props) {
  const { userInfo } = useGlobalStore();
  const { setToken, setUserInfo, setUserPackage } = useGlobalStore();

  const [open, setOpen] = useState(false);
  const t = useTranslations('webLabel');
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>();
  const timeOutRef = useRef<NodeJS.Timeout>();

  const refOutSide = React.useRef(null);

  const handleEnter = (isOpen) => {
    setOpen(true);
    clearTimeout(timeOutRef.current);
    !isOpen && triggerRef.current?.click();
  };

  const handleLeave = (isOpen) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && triggerRef.current?.click();
      setOpen(false);
    }, timeoutDuration);
  };

  useOnClickOutside(refOutSide, () => {
    open && triggerRef.current?.click();
    setOpen(false);
  });
  // useEffect(() => {
  //   console.log('o', open);
  // }, [open]);

  const handleLogOut = () => {
    const isAdmin = userInfo?.type === UserTypeConstant.Salesman;
    signOut({ redirect: false }).then(() => {
      Cookies.remove(AuthConstant.AccessTokenCookieName);
      setToken(null);
      setUserPackage(null);
      setUserInfo(null);
      if (!isAdmin) {
        router.push('/');
      } else {
        router.push('/account/login-admin');
      }
    });
  };

  let dataPortal = [
    {
      name: 'EcomLeftMenuBarMyPropoperties',
      href: '/client/tin-dang-cua-toi',
      icon: myPropertiesIcon,
      iconSelect: myPropopertiesSelectIcon,
      current: false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      iconSelect: myProfileSelectIcon,
      current: false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuBarMyFavorite',
      href: '/client/tin-yeu-thich',
      icon: myFavoriteIcon,
      iconSelect: myFavoriteSelectIcon,
      current: false,
      type: 'dropdown',
    },
  ];

  let dataPortalStaff = [
    {
      name: 'EcomPropertyListingPageMenuListing',
      href: '/admin/staff-properties',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_listing,
      iconSelect: myPropertiesIcon,
      current: false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      permission: appPermissions.portal_profile,
      iconSelect: myProfileIcon,
      current: false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuBarOwnInquiryManagement',
      href: '/admin/own-inquiry-admin',
      icon: ticketManagementIcon,
      iconSelect: ticketManagementIcon,
      permission: appPermissions.portal_owner_inquiry,
      current: false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/admin/client-inquiry-admin',
      icon: ticketManagementIcon,
      iconSelect: ticketManagementIcon,
      permission: appPermissions.portal_ticket,
      current: false,
      type: 'dropdown',
    },
  ];
  const _renderItemPorTal = (item: any, index: number) => {
    return (
      <div key={item.index + item.name}>
        <Link
          href={item.href}
          onClick={() => {
            open && triggerRef.current?.click();
            setOpen(false);
          }}
          className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700"
        >
          <div className="flex flex-shrink-0 items-center justify-center">
            <span className={`flex w-[25px] justify-start text-base`}>
              {item.current ? item.iconSelect : item.icon}
            </span>
            <div className="ml-3">
              <p className="text-sm font-medium">{t(item.name)}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const _renderItemPorTalStaff = (item: any, index: number) => {
    return (
      checkPermissionModule(userInfo?.accesses, item.permission) && (
        <div key={item.index + item.name}>
          <Link
            href={item.href}
            onClick={() => {
              open && triggerRef.current?.click();
              setOpen(false);
            }}
            className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700"
          >
            <div className="flex flex-shrink-0 items-center justify-center">
              <span className={`flex w-[25px] justify-start text-base`}>
                {item.current ? item.iconSelect : item.icon}
              </span>
              <div className="ml-3">
                <p className="text-sm font-medium">{t(item.name)}</p>
              </div>
            </div>
          </Link>
        </div>
      )
    );
  };
  return (
    <>
      <Popover className={`AvatarDropdown relative flex`}>
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={triggerRef}
              onClick={() => {
                setOpen(!open);
              }}
              className={`self-center ${className} flex h-10 items-center justify-center rounded-full text-slate-700 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 sm:h-12`}
            >
              <div className="flex flex-row items-center gap-2">
                <Avatar
                  sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  userName={`${userInfo?.fullName}`}
                  imgUrl={userInfo?.avatarUrl}
                />
                {userInfo && !isMobile && (
                  <>
                    <div>{`${userInfo?.fullName}`}</div>
                    <button className={clsx('transition-all ease-linear', open && 'rotate-180')}>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <div onMouseEnter={() => handleEnter(open)} onMouseLeave={() => handleLeave(open)}>
                <Popover.Panel
                  ref={refOutSide}
                  className="absolute right-0 top-full z-[50] mt-[10px] w-screen max-w-[260px] overflow-y-scroll px-4 sm:right-0 sm:px-0"
                >
                  <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid max-h-[500px] grid-cols-1 gap-6 overflow-y-auto bg-white px-6 py-7 dark:bg-neutral-800">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          sizeClass="w-12 h-12"
                          userName={`${userInfo?.fullName}`}
                          imgUrl={userInfo?.avatarUrl}
                        />

                        <div className="flex-grow">
                          <h4 className="text-one-line font-semibold">{userInfo?.fullName}</h4>
                          <p className="mt-0.5 text-xs">{userInfo?.address}</p>
                        </div>
                      </div>

                      <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                      {userInfo?.type === UserTypeConstant.Salesman
                        ? dataPortalStaff.map(_renderItemPorTalStaff)
                        : dataPortal.map(_renderItemPorTal)}
                      <Link
                        href={'/#'}
                        className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:hover:bg-neutral-700"
                        onClick={() => handleLogOut()}
                      >
                        <div className="flex flex-shrink-0 items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                              stroke="#FFD14B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 12H3.62"
                              stroke="#FFD14B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                              stroke="#FFD14B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{t('logOut')}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </Popover.Panel>
              </div>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
}
