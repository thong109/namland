'use client';
import apiTopupService from '@/apiServices/externalApiServices/apiTopupService';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import { ModalBuyPackageOpen } from '@/components/UserTopup/utils/ModalBuyPackageOpen';
import { ModalBuyPushPackageOpen } from '@/components/UserTopup/utils/ModalBuyPushPackageOpen';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import {
  flagEnglishIcon,
  flagVietNamIcon,
  iconDOMDOMIcon,
  mailBlackIcon,
  paymentSuccessIcon,
  PhoneBlackIcon,
} from '@/libs/appComponents';
import { statusPaymentOnline } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import { ResponePaymentStatus } from '@/models/TopupModel/responePaymentStatus';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const BuyPackageModal = dynamic(() => import('@/components/TopupModal/BuyPackageModal'), {
  ssr: false,
});
const BuyPushPackageModal = dynamic(() => import('@/components/TopupModal/BuyPushPackage'), {
  ssr: false,
});

const PagePaymentSuccessClient: FC = () => {
  const searchParams = useSearchParams();
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useRouter();
  const { userPackage, setUserPackage, userInfo } = useGlobalStore();
  const [isBuyPackageOpen, setIsBuyPackageOpen] = ModalBuyPackageOpen();
  const [isBuyPushPackageOpen, setIsBuyPushPackageOpen] = ModalBuyPushPackageOpen();

  const [_, setIsModalOpen] = ModalLoginOpen();

  const updateProfilePackage = async () => {
    const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
      authorization: null,
    });
    setUserPackage((resUserPackage as any)?.data);
  };

  const [infoPayemnt, setInfoPayment] = useState<ResponePaymentStatus>(undefined);
  const [statePayment, setStatePayment] = useState<string>(undefined);

  useEffect(() => {
    if (!userInfo) {
      setIsModalOpen(true);
      return;
    }
    const gwId = searchParams.get('gwId');
    getQueryOrder(gwId);
  }, [userInfo]);

  const getQueryOrder = async (gwId: string) => {
    try {
      const body = {
        transaction: gwId,
      };
      const infoPayment = await apiTopupService.getQueryOrder(body);

      setStatePayment(infoPayment?.data?.state);
      setInfoPayment(infoPayment);

      if (infoPayment?.data?.state === statusPaymentOnline.SUCCEEDED) {
        updateProfilePackage();
      }
    } catch {
      const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
        authorization: null,
      });
      setUserPackage((resUserPackage as any)?.data);
      setStatePayment(statusPaymentOnline.FAILED);
    }
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

            <div className="col-span-3 mt-4 grid h-[332px] w-[580px] grid-cols-1 rounded-xl bg-[#D4DFD1]">
              <div className="col-span-1 flex justify-center pb-3 pt-5 text-lg font-medium">
                {statePayment === statusPaymentOnline.SUCCEEDED ? (
                  comm('CheckPaymentSuccess')
                ) : (
                  <>
                    {comm('CheckPaymentFailed')}
                    <br />
                    {comm('NotePaymentFailed')}
                  </>
                )}
              </div>

              <div className="col-span-1 flex justify-center">{paymentSuccessIcon}</div>
              <div className="col-span-1 flex justify-center font-semibold">
                {t('WalletsBlance')} :{' '}
                {comm('MemberPoint', {
                  totalPoint: formatNumber(userPackage?.totalPoint ?? 0),
                })}
              </div>
              <div className="col-span-1 flex justify-center">
                <div className="flex">
                  <button
                    onClick={() => push('/client/tin-dang-cua-toi')}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('goBack')}
                  </button>
                  <button
                    onClick={() => setIsBuyPackageOpen(true)}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('BuyPackage')}
                  </button>
                  <button
                    onClick={() => setIsBuyPushPackageOpen(true)}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('BuyPush')}
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
                <div className="col-span-1 py-2">{infoPayemnt?.data?.transaction}</div>
                <div className="col-span-1 grid grid-cols-2 border-t border-[#DDDDDD]">
                  <div className="col-span-1 py-4 text-sm text-[#888888]">
                    <label>{comm('amountPaid')}</label>
                  </div>
                  <div className="col-span-1 flex justify-end py-4 text-xl font-semibold text-portal-primaryMainAdmin">
                    {formatNumber(infoPayemnt?.data?.amount)} VND
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
                <button onClick={() => onSelectLang('')} className="ml-1">
                  {flagVietNamIcon}
                </button>
              </div>
            </div>

            <div className="col-span-5 mt-4 grid w-full grid-cols-1 rounded-xl bg-[#D4DFD1]">
              <div className="col-span-1 flex justify-center pb-3 pt-5 text-lg font-medium">
                {statePayment === statusPaymentOnline.SUCCEEDED ? (
                  comm('CheckPaymentSuccess')
                ) : (
                  <>
                    {comm('CheckPaymentFailed')}
                    <br />
                    {comm('NotePaymentFailed')}
                  </>
                )}
              </div>

              <div className="col-span-3 flex justify-center">{paymentSuccessIcon}</div>
              <div className="col-span-3 flex justify-center font-semibold">
                {t('WalletsBlance')} :{' '}
                {comm('MemberPoint', {
                  totalPoint: formatNumber(userPackage?.totalPoint ?? 0),
                })}
              </div>
              <div className="col-span-3 flex justify-center pb-2">
                <div className="flex">
                  <button
                    onClick={() => push('/client/tin-dang-cua-toi')}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('goBack')}
                  </button>
                  <button
                    onClick={() => setIsBuyPackageOpen(true)}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('BuyPackage')}
                  </button>
                  <button
                    onClick={() => setIsBuyPushPackageOpen(true)}
                    className="mr-2 h-[36px] rounded-md bg-white px-2 font-medium text-black"
                  >
                    {comm('BuyPush')}
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
                <div className="col-span-1 py-2">{infoPayemnt?.data?.transaction}</div>
                <div className="col-span-1 grid grid-cols-2 border-t border-[#DDDDDD]">
                  <div className="col-span-1 py-4 text-sm text-[#888888]">
                    <label>{comm('amountPaid')}</label>
                  </div>
                  <div className="col-span-1 flex justify-end py-4 text-xl font-semibold text-portal-primaryMainAdmin">
                    {formatNumber(infoPayemnt?.data?.amount)} VND
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
      <BuyPackageModal isVisible={isBuyPackageOpen} closeModal={() => setIsBuyPackageOpen(false)} />
      <BuyPushPackageModal
        isVisible={isBuyPushPackageOpen}
        closeModal={() => setIsBuyPushPackageOpen(false)}
      />
    </div>
  );
};

export default PagePaymentSuccessClient;
