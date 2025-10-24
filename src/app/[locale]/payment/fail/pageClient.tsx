'use client';
import TransactionApiInAdmin from '@/apiServices/externalApiServices/apiTransactionService';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import {
  flagEnglishIcon,
  flagVietNamIcon,
  iconDOMDOMIcon,
  mailBlackIcon,
  paymentSuccessIcon,
  PhoneBlackIcon,
} from '@/libs/appComponents';
import { formatNumber } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const PagePaymentFailedClient: FC = () => {
  const searchParams = useSearchParams();
  const comm = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const [infoPayemnt, setInfoPayment] = useState<any>(undefined);

  const { push } = useRouter();

  const [_, setIsModalOpen] = ModalLoginOpen();
  const { userInfo } = useGlobalStore();

  useEffect(() => {
    if (!userInfo) {
      setIsModalOpen(true);
      return;
    }
    const orderId = searchParams.get('orderId');
    getQueryOrder(orderId);
  }, []);

  const getQueryOrder = async (orderId: string) => {
    try {
      const responseData: any = await TransactionApiInAdmin.getOrderById({ id: orderId });

      setInfoPayment(responseData);
    } catch {}
  };

  const onSelectLang = async (value: any) => {
    router.replace(`${pathname}?${searchParams.toString()}`, { locale: value });
  };

  const renderContent = () => {
    return (
      <div className="grid w-full grid-cols-5">
        {!isMobile ? (
          <>
            <div className="col-span-3 flex items-end py-2">{iconDOMDOMIcon}</div>
            <div className="col-span-2 grid grid-cols-1 leading-3">
              <div className="col-span-1 flex items-center justify-end">
                <span className="mr-2">{PhoneBlackIcon}</span>
                <span className="flex">090 665 1055 (09:00 - 18:00)</span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <span className="mr-2">{mailBlackIcon}</span>
                <span className="flex">support@ht-tech.vn</span>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <button onClick={() => onSelectLang('en')} className="mr-1">
                  {flagEnglishIcon}
                </button>
                |
                <button onClick={() => onSelectLang('vi')} className="ml-1">
                  {flagVietNamIcon}
                </button>
              </div>
            </div>
            <div className="col-span-3 mt-4 grid h-[332px] w-[560px] grid-cols-1 rounded-xl bg-[#FCE4E4]">
              <div className="col-span-1 flex justify-center pb-3 pt-5 text-lg font-medium">
                {comm('PaymentFailed')}
              </div>

              <div className="col-span-1 flex justify-center">{paymentSuccessIcon}</div>
              <div className="col-span-1 flex justify-center">
                <div className="flex">
                  <button
                    onClick={() => push('/client/tin-dang-cua-toi')}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('goBack')}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-2 mt-4">
              <div className="col-span-1 mb-5 flex h-[60px] items-center rounded-xl bg-white p-3">
                <label> {comm('infoOrder')}</label>
              </div>
              <div className="grid-col-span-1 col-span-1 grid rounded-xl bg-white p-3">
                <div className="col-span-1 py-2 text-sm text-[#888888]">{comm('supplier')}</div>
                <div className="col-span-1 py-2">{comm('nameWeb')}</div>
                <div className="col-span-1 py-2 text-sm text-[#888888]">{comm('codeOrder')}</div>
                <div className="col-span-1 py-2">{infoPayemnt?.data?.transId}</div>
                <div className="col-span-1 grid grid-cols-2 border-t border-[#DDDDDD]">
                  <div className="col-span-1 py-4 text-sm text-[#888888]">
                    <label>{comm('amountPaid')}</label>
                  </div>
                  <div className="col-span-1 flex justify-end py-4 text-xl font-semibold text-portal-primaryMainAdmin">
                    {formatNumber(infoPayemnt?.data?.totalAmount)} VND
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-[100vw] justify-center py-2">{iconDOMDOMIcon}</div>
            <div className="col-span-5 grid grid-cols-1 leading-3">
              <div className="col-span-1 mb-1 flex items-center justify-center">
                <span className="mr-2">{PhoneBlackIcon}</span>
                <span className="flex">090 665 1055 (09:00 - 18:00)</span>
              </div>
              <div className="col-span-1 mb-1 flex items-center justify-center">
                <span className="mr-2">{mailBlackIcon}</span>
                <span className="flex">support@ht-tech.vn</span>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                <button onClick={() => onSelectLang('en')} className="mr-1">
                  {flagEnglishIcon}
                </button>
                |
                <button onClick={() => onSelectLang('vi')} className="ml-1">
                  {flagVietNamIcon}
                </button>
              </div>
            </div>
            <div className="col-span-5 mt-4 grid w-full grid-cols-1 rounded-xl bg-[#FCE4E4]">
              <div className="col-span-1 flex justify-center pb-3 pt-5 text-lg font-medium">
                {comm('PaymentFailed')}
              </div>

              <div className="col-span-3 flex justify-center">{paymentSuccessIcon}</div>
              <div className="col-span-3 flex justify-center pb-2">
                <div className="flex">
                  <button
                    onClick={() => push('/client/tin-dang-cua-toi')}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('goBack')}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-5 mt-4">
              <div className="col-span-1 mb-5 flex h-[60px] items-center rounded-xl bg-white p-3">
                <label> {comm('infoOrder')}</label>
              </div>
              <div className="grid-col-span-1 col-span-1 grid rounded-xl bg-white p-3">
                <div className="col-span-1 py-2 text-sm text-[#888888]">{comm('supplier')}</div>
                <div className="col-span-1 py-2">{comm('nameWeb')}</div>
                <div className="col-span-1 py-2 text-sm text-[#888888]">{comm('codeOrder')}</div>
                <div className="col-span-1 py-2">{infoPayemnt?.data?.transId}</div>
                <div className="col-span-1 grid grid-cols-2 border-t border-[#DDDDDD]">
                  <div className="col-span-1 py-4 text-sm text-[#888888]">
                    <label>{comm('amountPaid')}</label>
                  </div>
                  <div className="col-span-1 flex justify-end py-4 text-xl font-semibold text-portal-primaryMainAdmin">
                    {formatNumber(infoPayemnt?.data?.totalAmount)} VND
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`nc-PayPage container`}>
      <div className="pb-40 pt-20">{renderContent()}</div>
    </div>
  );
};

export default PagePaymentFailedClient;
