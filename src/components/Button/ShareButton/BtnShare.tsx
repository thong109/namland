'use client';
import IconLink from '@/assets/icon/icon-link.svg';
import { Popover, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { FacebookIcon, FacebookShareButton } from 'next-share';
import Image from 'next/image';
import React, { FC, Fragment, useRef } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface BtnShareProps {
  className?: string;
  colorClass?: string;
  classNameBtn?: string;
}
const timeoutDuration = 60;
const BtnShare: FC<BtnShareProps> = ({ className = '', classNameBtn = '' }) => {
  const successNoti = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const triggerRef = useRef<HTMLButtonElement>();
  const timeOutRef = useRef<NodeJS.Timeout>();
  const handleEnter = (isOpen) => {
    clearTimeout(timeOutRef.current);
    !isOpen && triggerRef.current?.click();
  };

  const handleLeave = (isOpen) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && triggerRef.current?.click();
    }, timeoutDuration);
  };
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    if (type == 'default') {
      toast(message, {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      toast[type](message, {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, []);
  const shareFunction = async (type) => {
    switch (type) {
      case 'copy': {
        //statements;
        navigator.clipboard.writeText(window.location.href);
        notify('default', successNoti('copiedLink'));
        break;
      }
      case 'zalo': {
        //statements;
        break;
      }
      case 'facebook': {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  };
  return (
    <>
      <Popover className={`AvatarDropdown z-100 relative flex ${className}`}>
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={triggerRef}
              className={`${classNameBtn} mr-2 flex h-[30px] w-[30px] items-center justify-center self-center rounded-full bg-[#F6F8F9] text-slate-700 hover:bg-slate-100 focus:outline-none dark:hover:bg-slate-800`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2587_15535)">
                  <path
                    d="M11.1016 9.07812C10.2912 9.07812 9.57116 9.47193 9.12248 10.0781L5.25962 8.10403C5.32443 7.88386 5.35938 7.65103 5.35938 7.41016C5.35938 7.08392 5.29542 6.77239 5.17962 6.48722L9.22813 4.05478C9.67985 4.58497 10.3521 4.92188 11.1016 4.92188C12.4585 4.92188 13.5625 3.8179 13.5625 2.46094C13.5625 1.10398 12.4585 0 11.1016 0C9.7446 0 8.64062 1.10398 8.64062 2.46094C8.64062 2.77457 8.69971 3.07461 8.80715 3.3507L4.74852 5.78922C4.29713 5.27466 3.63511 4.94922 2.89844 4.94922C1.54148 4.94922 0.4375 6.0532 0.4375 7.41016C0.4375 8.76712 1.54148 9.87109 2.89844 9.87109C3.72209 9.87109 4.45244 9.46433 4.89937 8.84116L8.75101 10.8095C8.67929 11.0401 8.64062 11.2851 8.64062 11.5391C8.64062 12.896 9.7446 14 11.1016 14C12.4585 14 13.5625 12.896 13.5625 11.5391C13.5625 10.1821 12.4585 9.07812 11.1016 9.07812ZM11.1016 0.820312C12.0062 0.820312 12.7422 1.5563 12.7422 2.46094C12.7422 3.36558 12.0062 4.10156 11.1016 4.10156C10.1969 4.10156 9.46094 3.36558 9.46094 2.46094C9.46094 1.5563 10.1969 0.820312 11.1016 0.820312ZM2.89844 9.05078C1.9938 9.05078 1.25781 8.3148 1.25781 7.41016C1.25781 6.50552 1.9938 5.76953 2.89844 5.76953C3.80308 5.76953 4.53906 6.50552 4.53906 7.41016C4.53906 8.3148 3.80308 9.05078 2.89844 9.05078ZM11.1016 13.1797C10.1969 13.1797 9.46094 12.4437 9.46094 11.5391C9.46094 10.6344 10.1969 9.89844 11.1016 9.89844C12.0062 9.89844 12.7422 10.6344 12.7422 11.5391C12.7422 12.4437 12.0062 13.1797 11.1016 13.1797Z"
                    fill="#696969"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2587_15535">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Popover.Button>
            <div onMouseEnter={() => handleEnter(open)} onMouseLeave={() => handleLeave(open)}>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="z-100 !lg:left-0 absolute right-0 top-full mt-[10px] w-screen max-w-[260px] rounded bg-white px-4 sm:px-0 lg:right-auto lg:w-auto">
                  <div
                    className="flex cursor-pointer items-center border-b px-3 py-3 text-[14px]"
                    onClick={() => {
                      shareFunction('copy');
                      close();
                    }}
                  >
                    <Image alt="" src={IconLink} className="ml-1 mr-2 h-5 w-5" />
                    {t('copyLink')}
                  </div>
                  <div className="flex w-[260px] cursor-pointer items-center px-3 py-3 text-[14px] shadow-lg">
                    <FacebookShareButton url={window.location.href}>
                      <div className="flex w-full">
                        <FacebookIcon size={24} round className="mr-2" />
                        {t('ShareWithFacebook')}
                      </div>
                    </FacebookShareButton>
                  </div>
                </Popover.Panel>
              </Transition>
            </div>
          </>
        )}
      </Popover>
    </>
  );
};

export default BtnShare;
