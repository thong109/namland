'use client';
import authApiService from '@/apiServices/externalApiServices/authApiService';
import EnglishIcon from '@/assets/icon/english-header.svg';
import KoreaIcon from '@/assets/icon/korea-header.svg';
import VietNameIcon from '@/assets/icon/vietnam-header.svg';
import { assetsImages } from '@/assets/images/package';
import usePropertyType from '@/hooks/usePropertyType';
import useGlobalStore from '@/stores/useGlobalStore';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import Image from 'next/image';
import * as NProgress from 'nprogress';
import React, { FC, Fragment, useRef, useState, useTransition } from 'react';
import useOnClickOutside from 'use-onclickoutside';

export const headerLanguage = [
  {
    id: 'English',
    name: 'English',
    title: 'EN',
    description: 'United State',
    value: 'en',
    icon: EnglishIcon,
  },
  {
    id: 'Vietnamese',
    name: 'Vietnamese',
    title: 'VN',
    description: 'Vietnamese',
    value: 'vi',
    icon: VietNameIcon,
  },
  {
    id: 'Korea',
    name: 'Korea',
    title: 'KR',
    description: 'Korea',
    value: 'ko',
    icon: KoreaIcon,
  },
];

interface LangDropdownProps {
  panelClassName?: string;
  isHiddenIcon?: boolean;
}
const timeoutDuration = 60;
const LangDropdown: FC<LangDropdownProps> = ({
  panelClassName = 'z-10 w-max max-w-[280px] px-4 mt-4 right-0 sm:px-0 lg:w-screen',
  isHiddenIcon = false,
}) => {
  const t = useTranslations('Language');

  const { refreshPropertyType } = usePropertyType();
  const { userInfo } = useGlobalStore();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRefLang = useRef<HTMLButtonElement>();
  const timeOutRef = useRef<NodeJS.Timeout>();
  const refOutSideLang = React.useRef(null);
  const handleEnter = (isOpen) => {
    setOpen(true);
    clearTimeout(timeOutRef.current);
    !isOpen && triggerRefLang.current?.click();
  };

  const handleLeave = (isOpen) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && triggerRefLang.current?.click();
      setOpen(false);
    }, timeoutDuration);
  };

  useOnClickOutside(refOutSideLang, () => {
    open && triggerRefLang.current?.click();
    setOpen(false);
  });
  const onSelectLang = async (value: any) => {
    NProgress.start();
    if (value == locale) {
      return;
    }

    Cookies.set('NEXT_LOCALE', value);

    if (userInfo) {
      const response = await authApiService.updateLang(value);

      if (response.success) {
        startTransition(() => {
          // Replace the current route with the new locale in options
          router.replace(pathname, {
            locale: value, // Set the locale here in the options object
          });
        });
      }
    } else {
      startTransition(() => {
        // Replace the current route with the new locale in options
        router.replace(pathname, {
          locale: value, // Set the locale here in the options object
        });
      });
    }
    setTimeout(() => {
      refreshPropertyType();
    }, 1500);
  };
  return (
    <div className="LangDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={triggerRefLang}
              onClick={() => {
                setOpen(!open);
              }}
              className={` ${open ? '' : 'text-opacity-80'} select-header-language group inline-flex items-center rounded-full py-1.5 text-sm font-medium text-gray-700 hover:text-opacity-100 focus:outline-none dark:text-neutral-300`}
              style={{ backgroundImage: `url(${assetsImages.commonIconLanguage.src})` }}
            >
              {headerLanguage.map((item) => {
                return (
                  <div
                    className={`${locale != item.value ? 'hidden' : ''} mx-1 self-center`}
                    key={item.id}
                  >
                    <span>{item.title}</span>
                  </div>
                );
              })}
              {isHiddenIcon ? null : (
                <ChevronDownIcon
                  className={`${open ? '-rotate-180' : 'text-opacity-70'} ml-2 h-4 w-4 transition duration-150 ease-in-out group-hover:text-opacity-80 flex-[0_0_auto]`}
                  aria-hidden="true"
                />
              )}
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
                <Popover.Panel ref={refOutSideLang} className={`absolute ${panelClassName}`}>
                  <div className="w-max overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 lg:w-full">
                    <div className="relative grid gap-7 bg-white p-7 lg:grid-cols-1">
                      {headerLanguage.map((item, index) => (
                        <a
                          key={index + item.id}
                          // href={item.value}
                          onClick={() => {
                            onSelectLang(item.value);
                          }}
                          className={`${
                            locale == item.value ? 'bg-neutral-100' : 'bg-trasparent'
                          } -m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${'opacity-80'}`}
                        >
                          <div className="flex flex-row items-center justify-center">
                            <div className="mr-2">
                              <Image
                                src={item.icon}
                                alt={item.description}
                                className="w-5 object-contain"
                              ></Image>
                            </div>
                            <div>
                              <p className="cursor-default text-sm font-medium">{t(item.name)}</p>
                              <p className="cursor-default text-xs text-gray-500 dark:text-neutral-400">
                                {t(item.description)}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </Popover.Panel>
              </div>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
export default LangDropdown;
