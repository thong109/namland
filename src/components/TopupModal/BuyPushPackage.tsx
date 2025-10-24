'use client';
import apiTopupService from '@/apiServices/externalApiServices/apiTopupService';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { nextIcon, prevIcon, wallMoneyIcon } from '@/libs/appComponents';
import { listStatusProject, listingType, packageEnum, packageListingEnum } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import { PushModel } from '@/models/TopupModel/Packagemodel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Carousel, Checkbox, Form, Radio } from 'antd';
import Modal from 'antd/es/modal';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';
import TopupModal from './TopupModal';

interface BuyPackageModalProps {
  closeModal: () => void;
  isVisible: boolean;
}

const BuyPushPackageModal: React.FC<BuyPackageModalProps> = ({ isVisible, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const locale = useLocale();
  const { userPackage, setUserPackage } = useGlobalStore();

  const [formRef] = Form.useForm();
  const error = useTranslations('error');
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const errorNotifi = useTranslations('errorNotifi');
  const [formRefTopup] = Form.useForm();
  const [pushPackageInfo, setPushPackageInfo] = useState<PushModel[]>([]);
  const [allowTopup, setAllowTopup] = useState<boolean>(true);
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [isWaringWallet, setIsWaringWallet] = useState<boolean>(false);
  const [amountNeedPayment, setAmountNeedPayment] = useState<number>(0);
  const [enumPackage, setEnumPackage] = useState<number>(0);
  const [isTopupOpen, setIsTopupOpen] = useState(false);

  useEffect(() => {
    if (allSettingLandingPage) {
      const allowTopup = allSettingLandingPage?.find((item) => item.key === 'ZONE_TOP_UP');

      if (allowTopup !== undefined) {
        setAllowTopup(allowTopup?.value);
      }
    }
  }, [allSettingLandingPage]);

  useEffect(() => {
    if (isVisible) {
      initDataGenUI();
    }
  }, [isVisible]);

  const initDataGenUI = () => {
    formRef.setFieldsValue({
      type: listingType.sale,
      packageType: packageEnum.Listing10,
    });
    getListPackageInfo();
    setEnumPackage(undefined);
  };

  const handleCloseModal = () => {
    closeModal();
    setPushPackageInfo(undefined);
    formRef.resetFields();
    setIsWaringWallet(false);
  };

  const handlePayment = async () => {
    await formRef.validateFields();
    const values = formRef.getFieldsValue();
    if (!values?.isAllowPayment) {
      return formRef.setFields([
        {
          name: 'isAllowPayment',
          errors: [error('isRequiredPolicy')],
        },
      ]);
    }
    if (!pushPackageInfo?.find((item) => item.packageType === enumPackage)?.id) {
      return notify('error', errorNotifi('requiredPickPage'));
    }
    startTransition(async () => {
      const body = {
        listingPushPackageId: pushPackageInfo?.find((item) => item.packageType === enumPackage)?.id,
        totalPoint: totalPoint,
      };
      try {
        await apiTopupService.redeemAPush(body).then(() => updateProfilePackage(false));
        notify('success', success('topupSuccessTopupPackage'));
      } catch (e) {
        notify('error', e.response?.data?.message);
      }
    });
    handleCloseModal();
  };

  const handleTopup = () => {
    let totalAmount;
    if (amountNeedPayment < 9999) {
      totalAmount = 10000;
    } else {
      totalAmount = amountNeedPayment;
    }

    //Open topup modal
    formRefTopup.setFieldValue('totalAmount', totalAmount);
    setIsTopupOpen(true);
  };
  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };
  const updateProfilePackage = async (isCheckWallet: boolean) => {
    const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
      authorization: null,
    });
    setUserPackage((resUserPackage as any)?.data);

    if (isCheckWallet) {
      if ((resUserPackage as any)?.data?.totalPoint >= totalPoint) {
        setIsWaringWallet(false);
      } else {
        setIsWaringWallet(true);
      }
    }
  };

  const getListPackageInfo = async () => {
    const values = formRef.getFieldsValue();

    const params = {
      type: values.type,
    };

    const response: any = await apiTopupService.getListRedeemPackage(params);

    setPushPackageInfo(response?.pushPackage);

    setIsWaringWallet(false);
  };

  const onCalculator = (enumPackage: number) => {
    setEnumPackage(enumPackage);
    const point = pushPackageInfo?.find((item) => item.packageType === enumPackage)?.point;
    if (userPackage?.totalPoint < point) {
      setIsWaringWallet(true);
      setAmountNeedPayment(point - userPackage?.totalPoint);
    } else {
      setIsWaringWallet(false);
      setAmountNeedPayment(0);
    }
    setTotalPoint(point);
  };

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          position: 'absolute',
          top: '70px',
          color: 'transparent',
          right: '40px',
        }}
        onClick={onClick}
      >
        {nextIcon}
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: 'transparent',
          display: 'block',
          top: '70px',
          left: '40px',
        }}
        onClick={onClick}
      >
        {prevIcon}
      </div>
    );
  };

  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <Modal
        className="z-[8888]"
        style={{ borderRadius: '0px' }}
        styles={{
          wrapper: {
            background: 'none',
          },
          content: {
            padding: '0px',
            borderRadius: '20px',
            background: '#D4DFD1',
            boxShadow: 'none',
          },
        }}
        open={isVisible}
      
        onCancel={handleCloseModal}
        closable={false}
        footer={null}
        width={'1050px'}
      >
        <div className="w-full">
          <Form form={formRef} layout="vertical">
            {!isMobile ? (
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-portal-primaryMainAdmin p-2">
                {/* Chọn loại, mua hay bán */}
                <div className="col-span-12 rounded-full bg-white px-2">
                  <Form.Item name="type">
                    <Radio.Group
                      onChange={getListPackageInfo}
                      optionType="button"
                      buttonStyle="solid"
                      size="large"
                      className="grid grid-cols-2"
                    >
                      {listStatusProject.map((item) => (
                        <Radio
                          className="col-span-1 ml-2 mt-2 !rounded-full text-center"
                          value={item?.id}
                        >
                          {t(item?.name)}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>

                {/* Buy lượt push */}
                <div className="col-span-12 mt-2 grid grid-cols-10 rounded-3xl bg-white px-4 py-8">
                  <div className="col-span-4 grid grid-cols-1 items-start">
                    <div className="col-span-1">
                      <label className="ml-2 text-base font-bold text-[#575757]">
                        {t('BuyPushAllowSelectPush')}
                      </label>
                    </div>
                    <div className="col-span-1">{t('TimeOfListingPushing')}</div>
                  </div>

                  <div className="col-span-6 grid grid-cols-3">
                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                        <label className="font-medium text-[#575757]">{comm('Basic')}</label>
                        <div className="col-span-1">
                          {formatNumber(
                            pushPackageInfo?.find(
                              (item) => item.packageType === packageListingEnum.Basic,
                            )?.point,
                          )}
                        </div>

                        <Button
                          onClick={() => onCalculator(packageListingEnum.Basic)}
                          className={`${
                            enumPackage === packageListingEnum.Basic
                              ? 'bg-portal-primaryButtonAdmin text-white'
                              : 'border border-[#B8B9B9] bg-white'
                          } w-[80px] !rounded-md text-center`}
                        >
                          {comm('Select')}
                        </Button>
                      </div>
                    </div>

                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                        <label className="font-medium text-white">{comm('Gold')}</label>
                        <div className="col-span-1">
                          {formatNumber(
                            pushPackageInfo?.find(
                              (item) => item.packageType === packageListingEnum.Gold,
                            )?.point,
                          )}
                        </div>
                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#F8D778] text-[#A67C00]">
                          {comm('Gold')}
                        </div>
                        <Button
                          onClick={() => onCalculator(packageListingEnum.Gold)}
                          className={`${
                            enumPackage === packageListingEnum.Gold
                              ? 'bg-portal-primaryButtonAdmin text-white'
                              : 'border border-[#B8B9B9] bg-white'
                          } w-[80px] !rounded-md text-center`}
                        >
                          {comm('Select')}
                        </Button>
                      </div>
                    </div>

                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                        <label className="font-medium text-white">{comm('Platinum')}</label>
                        <div className="col-span-1">
                          {formatNumber(
                            pushPackageInfo?.find(
                              (item) => item.packageType === packageListingEnum.Platinum,
                            )?.point,
                          )}
                        </div>
                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#DAD8D4] text-[#404040]">
                          {comm('Platinum')}
                        </div>
                        <Button
                          onClick={() => onCalculator(packageListingEnum.Platinum)}
                          className={`${
                            enumPackage === packageListingEnum.Platinum
                              ? 'bg-portal-primaryButtonAdmin text-white'
                              : 'border border-[#B8B9B9] bg-white'
                          } w-[80px] !rounded-md text-center`}
                        >
                          {comm('Select')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thanh toán*/}
                <div className="col-span-12 mt-2 grid grid-cols-10 rounded-3xl bg-white p-5">
                  <div className="col-span-5 text-xl font-medium text-[#2C2C2C]">
                    {comm('Payment')}
                  </div>
                  <div className="grid-col-1 col-span-5 grid justify-end font-medium">
                    <div className="col-span-1 text-base">{t('WalletsBlance')}</div>
                    <div className="col-span-1 flex text-xs">
                      {wallMoneyIcon} &ensp;
                      {comm('MemberPoint', {
                        totalPoint: formatNumber(userPackage?.totalPoint ?? 0),
                      })}
                    </div>
                  </div>

                  <div className="col-span-10 grid grid-cols-10">
                    <div className="col-span-10 mb-3 font-semibold text-[#505050]">
                      {comm('PushLisingPackage')}
                    </div>
                    <div className="col-span-7 mb-3">
                      {comm('TurnPush', {
                        total: formatNumber(
                          pushPackageInfo?.find((item) => item.packageType === enumPackage)
                            ?.numberOfPush,
                        ),
                      })}
                    </div>
                    <div className="col-span-3 mb-3 grid grid-cols-2">
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {formatNumber(
                          pushPackageInfo?.find((item) => item.packageType === enumPackage)?.point,
                        )}
                      </div>
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {t('EcomListPackageDetailListingPoint')}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 my-2 border-t border-portal-primaryButtonAdmin"></div>
                  <div className="col-span-7 grid grid-cols-1 text-base font-medium text-portal-primaryMainAdmin">
                    {t('EcomPackagePushTotalPoint')}
                  </div>
                  <div className="col-span-3 mb-3 grid grid-cols-2 text-base font-medium text-portal-primaryMainAdmin">
                    <div className="col-span-1">
                      {formatNumber(
                        pushPackageInfo?.find((item) => item.packageType === enumPackage)?.point,
                      )}
                    </div>
                    <div className="col-span-1">{t('EcomListPackageDetailListingPoint')}</div>
                  </div>
                  <div className="col-span-12">{t('NoteTimeUsePush')}</div>
                  <div className="col-span-12">
                    {t.rich('detailLink', {
                      quychehoatdong: (chunks) => (
                        <span className="underline" onClick={openLink}>
                          {chunks}
                        </span>
                      ),
                      dieukhoandieukien: (chunks) => (
                        <span className="underline" onClick={openLinkDieukhoandieukien}>
                          {chunks}
                        </span>
                      ),
                    })}
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="isAllowPayment" valuePropName="checked">
                      <Checkbox type="checkbox">{t('IAgreeWithNote')}</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                {/* Waring không đủ tiền */}
                {isWaringWallet && (
                  <div className="col-span-12 mt-2 rounded-2xl bg-[#FEECE3] p-4">
                    <span className="rounded bg-portal-rejectColor100 p-1 text-xs text-white">
                      {comm('WalletBalanceWarning')}
                    </span>
                    <p className="py-2 text-xs">
                      {comm('warningTopup', {
                        amountNeed: formatNumber(amountNeedPayment),
                      })}
                    </p>
                  </div>
                )}

                <div className="col-span-12 mt-2 flex justify-end">
                  <Button
                    className={`!bg-portal-gray-2 text-sm !text-portal-black`}
                    onClick={handleCloseModal}
                  >
                    {comm('Cancel')}
                  </Button>
                  {isWaringWallet ? (
                    <>
                      {allowTopup && (
                        <Button
                          loading={isPending}
                          className={`ml-2 !bg-portal-primaryButtonAdmin text-sm !text-portal-black`}
                          onClick={handleTopup}
                        >
                          {comm('topupAmount', {
                            amountNeed: formatNumber(
                              amountNeedPayment < 9999 ? 10000 : amountNeedPayment,
                            ),
                          })}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      loading={isPending}
                      disabled={enumPackage === 0 || isWaringWallet}
                      className={`ml-2 !bg-portal-primaryButtonAdmin text-sm !text-portal-black`}
                      onClick={handlePayment}
                    >
                      {comm('Payment')}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-portal-primaryMainAdmin p-2">
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-2">
                  <div className="col-span-12">
                    <label className="ml-2 text-base font-bold text-[#575757]">
                      {t('BuyPushAllowSelectPush')}
                    </label>
                  </div>
                  <div className="col-span-12 my-4"> {t('TimeOfListingPushing')}</div>

                  <div className="col-span-12">
                    <Carousel
                      {...settings}
                      slidesToScroll={1}
                      dots={false}
                      arrows
                      infinite={false}
                      slidesToShow={1}
                    >
                      <div className="col-span-1">
                        <div className="flex w-full justify-center">
                          <div className="m-3 flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                            <label className="font-medium text-[#575757]">{comm('Basic')}</label>
                            <div className="col-span-1">
                              {formatNumber(
                                pushPackageInfo?.find(
                                  (item) => item.packageType === packageListingEnum.Basic,
                                )?.point,
                              )}
                            </div>

                            <Button
                              onClick={() => onCalculator(packageListingEnum.Basic)}
                              className={`${
                                enumPackage === packageListingEnum.Basic
                                  ? 'bg-portal-primaryButtonAdmin text-white'
                                  : 'border border-[#B8B9B9] bg-white'
                              } w-[80px] !rounded-md text-center`}
                            >
                              {comm('Select')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <div className="flex w-full justify-center">
                          <div className="relative my-[30px] flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                            <label className="font-medium text-white">{comm('Gold')}</label>
                            <div className="col-span-1">
                              {formatNumber(
                                pushPackageInfo?.find((item) => item.packageType === enumPackage)
                                  ?.point,
                              )}
                            </div>
                            <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#F8D778] text-[#A67C00]">
                              {comm('Gold')}
                            </div>
                            <Button
                              onClick={() => onCalculator(packageListingEnum.Gold)}
                              className={`${
                                enumPackage === packageListingEnum.Gold
                                  ? 'bg-portal-primaryButtonAdmin text-white'
                                  : 'border border-[#B8B9B9] bg-white'
                              } w-[80px] !rounded-md text-center`}
                            >
                              {comm('Select')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <div className="flex w-full justify-center">
                          <div className="relative my-[30px] flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC]">
                            <label className="font-medium text-white">{comm('Platinum')}</label>
                            <div className="col-span-1">
                              {formatNumber(
                                pushPackageInfo?.find((item) => item.packageType === enumPackage)
                                  ?.point,
                              )}
                            </div>
                            <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#DAD8D4] text-[#404040]">
                              {comm('Platinum')}
                            </div>
                            <Button
                              onClick={() => onCalculator(packageListingEnum.Platinum)}
                              className={`${
                                enumPackage === packageListingEnum.Platinum
                                  ? 'bg-portal-primaryButtonAdmin text-white'
                                  : 'border border-[#B8B9B9] bg-white'
                              } w-[80px] !rounded-md text-center`}
                            >
                              {comm('Select')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Carousel>
                  </div>
                </div>

                <div className="col-span-12 my-2 grid grid-cols-10 rounded-3xl bg-white p-5">
                  <div className="col-span-5 text-xl font-medium text-[#2C2C2C]">
                    {comm('Payment')}
                  </div>
                  <div className="grid-col-1 col-span-5 grid justify-end font-medium">
                    <div className="col-span-1 text-base">{t('WalletsBlance')}</div>
                    <div className="col-span-1 flex text-xs">
                      {wallMoneyIcon} &ensp;
                      {comm('MemberPoint', {
                        totalPoint: formatNumber(userPackage?.totalPoint ?? 0),
                      })}
                    </div>
                  </div>

                  <div className="col-span-10 grid grid-cols-10">
                    <div className="col-span-10 mb-3 font-semibold text-[#505050]">
                      {comm('PushLisingPackage')}
                    </div>
                    <div className="col-span-5 mb-3">
                      {comm('TurnPush', {
                        total: formatNumber(
                          pushPackageInfo?.find((item) => item.packageType === enumPackage)
                            ?.numberOfPush,
                        ),
                      })}
                    </div>
                    <div className="col-span-5 mb-3 grid grid-cols-2">
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {formatNumber(
                          pushPackageInfo?.find((item) => item.packageType === enumPackage)?.point,
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end font-medium text-[#2C2C2C]">
                        {t('EcomListPackageDetailListingPoint')}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 my-2 border-t border-portal-primaryButtonAdmin"></div>
                  <div className="col-span-5 grid grid-cols-1 text-base font-medium text-portal-primaryMainAdmin">
                    {t('EcomPackagePushTotalPoint')}
                  </div>
                  <div className="col-span-5 mb-3 grid grid-cols-2 text-base font-medium text-portal-primaryMainAdmin">
                    <div className="col-span-1">
                      {formatNumber(
                        pushPackageInfo?.find((item) => item.packageType === enumPackage)?.point,
                      )}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {t('EcomListPackageDetailListingPoint')}
                    </div>
                  </div>
                  <div className="col-span-12">{t('NoteTimeUsePush')}</div>
                  <div className="col-span-12">
                    {t.rich('detailLink', {
                      quychehoatdong: (chunks) => (
                        <span className="underline" onClick={openLink}>
                          {chunks}
                        </span>
                      ),
                      dieukhoandieukien: (chunks) => (
                        <span className="underline" onClick={openLinkDieukhoandieukien}>
                          {chunks}
                        </span>
                      ),
                    })}
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="isAllowPayment" valuePropName="checked">
                      <Checkbox type="checkbox">{t('IAgreeWithNote')}</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                {isWaringWallet && (
                  <div className="mb-2 rounded-2xl bg-[#FEECE3] p-2">
                    <span className="rounded bg-portal-rejectColor100 p-1 text-xs text-white">
                      {comm('WalletBalanceWarning')}
                    </span>
                    <p className="py-2 text-xs">
                      {comm('warningTopup', {
                        amountNeed: formatNumber(amountNeedPayment),
                      })}
                    </p>
                  </div>
                )}

                <div className="mb-2 flex flex-wrap justify-end rounded-2xl bg-white p-3">
                  <Button
                    className={`mt-1 w-full !bg-portal-gray-2 text-sm !text-portal-black lg:w-fit`}
                    onClick={handleCloseModal}
                  >
                    {comm('Cancel')}
                  </Button>
                  {isWaringWallet ? (
                    <>
                      {allowTopup && (
                        <Button
                          loading={isPending}
                          className={`mt-1 w-full !bg-portal-primaryButtonAdmin text-sm !text-portal-black lg:w-fit`}
                          onClick={handleTopup}
                        >
                          {comm('topupAmount', {
                            amountNeed: formatNumber(
                              amountNeedPayment < 9999 ? 10000 : amountNeedPayment,
                            ),
                          })}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      loading={isPending}
                      disabled={enumPackage === 0 || isWaringWallet}
                      className={`mt-1 w-full !bg-portal-primaryButtonAdmin text-sm !text-portal-black lg:w-fit`}
                      onClick={handlePayment}
                    >
                      {comm('Payment')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Form>
        </div>
      </Modal>
      <TopupModal
        isVisible={isTopupOpen}
        closeModal={() => setIsTopupOpen(false)}
        formRef={formRefTopup}
      />
    </>
  );
};

export default BuyPushPackageModal;
