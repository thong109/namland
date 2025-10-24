'use client';
import notifyApiService from '@/apiServices/externalApiServices/apiNotification';
import { socketService } from '@/apiServices/internalApiServices/signalRConection';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import { eyeIcon, notiIcon } from '@/libs/appComponents';
import { NotifyType } from '@/libs/appconst';
import useGlobalStore from '@/stores/useGlobalStore';
import { Popover, Transition } from '@headlessui/react';
import { Badge } from 'antd';
import { useTranslations } from 'next-intl';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import useOnClickOutside from 'use-onclickoutside';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const timeoutDuration = 60;

const NotifyDropdown: FC = () => {
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const { userInfo, setUserPackage } = useGlobalStore();

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>();
  const timeOutRef = useRef<NodeJS.Timeout>();

  const refOutSide = React.useRef(null);
  const [count, setCount] = useState<any>(0);

  const pushNotify = async (payload) => {
    if (userInfo?.id === payload?.data?.userId) {
      switch (payload?.data.type) {
        case NotifyType.CREATE_LISTING_SUCCESS_CUSTOMER:
          notify('info', payload?.data?.title);
          break;

        case NotifyType.LISTING_APPROVED_OWNER:
          notify('info', payload?.data?.title);
          const dataPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
            authorization: null,
          });
          setUserPackage((dataPackage as any)?.data);
          break;

        case NotifyType.LISTING_REJECTED_OWNER:
          notify('info', payload?.data?.title);
          const responseUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
            authorization: null,
          });
          setUserPackage((responseUserPackage as any)?.data);
          break;

        case NotifyType.LISTING_EXPIRED_OWNER:
          notify('info', payload?.data?.title);
          break;

        case NotifyType.LISTING_TAKEDOWN_OWNER:
          notify('info', payload?.data?.title);
          break;

        case NotifyType.CREATE_INQUIRY_CUSTOMER:
          notify('info', payload?.data?.title);
          break;
        case NotifyType.CREATE_SITEVISIT_CUSTOMER:
          notify('info', payload?.data?.title);
          break;
        case NotifyType.CONVERSATION:
          notify('info', payload?.data?.title);
          break;
        case NotifyType.TOP_UP_COMPLETED:
          // call api update ví
          notify('info', payload?.data?.title);
          const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
            authorization: null,
          });
          setUserPackage((resUserPackage as any)?.data);
          break;
        case NotifyType.PURCHASED_SUCCESSFULLY:
          notify('info', payload?.data?.title);
          break;
        default:
      }
    }
  };

  const getCountUnRead = async () => {
    const count = await notifyApiService.getCountUnRead();
    setCount(count);
  };

  useEffect(() => {
    if (userInfo?.id) {
      getCountUnRead();
      socketService.registerOnServerEvents('notify', async (payload) => {
        if (userInfo?.id === payload?.data?.recipient) {
          notify('info', ` ${t('EcomPropertyNotifyInquiryConversationSend')}`);
        }
        if (userInfo?.id === payload?.data?.userId) {
          pushNotify(payload);
          return;
        }
      });
    } else {
      socketService.stopConnection('notify');
    }
  }, [userInfo?.id]);

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

  const markReadAll = async () => {
    await notifyApiService.markReadAll();
  };

  return (
    <>
      <Popover className="relative flex">
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={triggerRef}
              onClick={() => {
                setOpen(!open);
              }}
              className={` ${
                open ? '' : 'text-opacity-90'
              } group relative inline-flex h-10 w-10 items-center justify-center self-center rounded-full text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-opacity-75 dark:hover:bg-neutral-800 sm:h-12 sm:w-12`}
            >
              <Badge count={count}>
                <div className="rounded-full bg-portal-gray-1 p-1">{notiIcon}</div>
              </Badge>
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
              <div
                className="fixed -right-28 top-full z-10 mr-3 mt-2 w-screen max-w-xs px-4 sm:right-0 sm:max-w-sm sm:px-0"
                onMouseEnter={() => handleEnter(open)}
                onMouseLeave={() => handleLeave(open)}
              >
                <Popover.Panel>
                  <div className="rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-x-3 p-5 dark:bg-neutral-800">
                      <div className="flex items-end justify-end text-xl font-semibold">
                        <h3 className="mr-1">{comm('Notifications')}</h3>
                        <div className="rounded-lg bg-portal-gray-1 p-2">{eyeIcon}</div>
                      </div>
                      <div className="flex items-end justify-end py-1 text-xs">
                        <button className="underline hover:text-sky-700" onClick={markReadAll}>
                          {t('MarkReadAll')}
                        </button>
                      </div>

                      <NotifyComponent />
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
};

export default NotifyDropdown;
