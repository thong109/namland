'use client';
import apiTopupService from '@/apiServices/externalApiServices/apiTopupService';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { collapseIcon, nextIcon, prevIcon, wallMoneyIcon } from '@/libs/appComponents';
import {
  listPackage,
  listPackageEnum,
  listStatusProject,
  listingType,
  packageEnum,
  packageListingEnum,
} from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import { PackageModel, PushModel } from '@/models/TopupModel/Packagemodel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Carousel, Checkbox, Form, Radio, Select, Switch } from 'antd';
import Modal from 'antd/es/modal';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';
import { ModalTopupOpen } from '../UserTopup/utils/ModalTopupOpen';
import TopupModal from './TopupModal';

interface packageInfo {
  id?: number;
  package?: number;
  packageType?: number;
  type?: number;
  point?: number;
  status?: number;
  numberOfPush?: number;
  percentDecrease?: number;
  discountedPoint?: number;
  totalPoint?: number;
  listingPushPackageId?: number;
  pointPackagePush?: number;
}

interface BuyPackageModalProps {
  closeModal: () => void;
  isVisible: boolean;
}

const BuyPackageModal: React.FC<BuyPackageModalProps> = ({ isVisible, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const { allSettingLandingPage } = useAllSettingLandingPage();

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const errorNotifi = useTranslations('errorNotifi');
  const locale = useLocale();
  const { userPackage, setUserPackage } = useGlobalStore();
  const [showDetailPackage, setShowDetailPackage] = useState<boolean>(false);
  const error = useTranslations('error');
  const [formRef] = Form.useForm();
  const [formRefTopup] = Form.useForm();
  const [listItemPackage, setListItemPackage] = useState<PackageModel[]>([]);
  const [listItemPush, setListItemPush] = useState<PushModel[]>([]);
  const [allowBuyPush, setAllowBuyPush] = useState<boolean>(false);
  const [infoPickPackage, setInfoPickPackage] = useState<packageInfo>(undefined);
  const [isWaringWallet, setIsWaringWallet] = useState<boolean>(false);
  const [amountNeedPayment, setAmountNeedPayment] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [isOpenedBefore, setIsOpenedBefore] = useState<boolean>(false);
  const [isTopupOpen, setIsTopupOpen] = ModalTopupOpen();
  const [allowTopup, setAllowTopup] = useState<boolean>(true);
  const [maxNumberPublicDate, setMaxNumberPublicDate] = useState(
    _.find(allSettingLandingPage, { key: 'MAX_NUMBER_OF_PUBLISH_DAYS' })?.value ?? 0,
  );

  useEffect(() => {
    if (allSettingLandingPage) {
      if (!maxNumberPublicDate) {
        let find = _.find(allSettingLandingPage, { key: 'MAX_NUMBER_OF_PUBLISH_DAYS' });
        if (find && find.value !== maxNumberPublicDate) {
          setMaxNumberPublicDate(find.value);
        }
      }

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

    if (isVisible && !isOpenedBefore) {
      setIsOpenedBefore(true);
    }
  }, [isVisible]);

  const initDataGenUI = () => {
    formRef.setFieldsValue({
      type: listingType.sale,
      packageType: packageEnum.Listing1,
    });

    setAllowBuyPush(false);
    getListPackageInfo(packageEnum.Listing1, listingType.sale);
  };

  const handleCloseModal = () => {
    closeModal();
    setInfoPickPackage(undefined);
    setListItemPush(undefined);
    setListItemPackage(undefined);
    formRef.resetFields();
    setIsWaringWallet(false);
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
    const body = {
      listingPackageId: infoPickPackage?.id,
      listingPushPackageId: infoPickPackage?.listingPushPackageId
        ? infoPickPackage?.listingPushPackageId
        : undefined,
      totalPoint: infoPickPackage?.totalPoint,
    };
    if (!body?.listingPackageId) {
      return notify('error', errorNotifi('requiredPickPage'));
    }
    startTransition(async () => {
      await apiTopupService.redeemAPackage(body).then(() => updateProfilePackage(false));
    });
    notify('success', success('topupSuccessTopupPackage'));
    handleCloseModal();
  };

  const updateProfilePackage = async (isCheckWallet: boolean) => {
    const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
      authorization: null,
    });
    setUserPackage((resUserPackage as any)?.data);

    if (isCheckWallet) {
      if ((resUserPackage as any)?.data?.totalPoint >= infoPickPackage?.totalPoint) {
        setIsWaringWallet(false);
      } else {
        setIsWaringWallet(true);
      }
    }
  };
  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };
  const getListPackageInfo = async (packageType?: number, type?: number) => {
    if (packageType && type) {
      const params = {
        package: packageType,
        type: type,
      };

      const response: any = await apiTopupService.getListRedeemPackage(params);

      setListItemPackage(response?.packages ?? []);
      setListItemPush(response?.pushPackage ?? []);

      setInfoPickPackage(undefined);
      setIsWaringWallet(false);
    } else {
      const values = formRef.getFieldsValue();
      const isValid = values?.type !== undefined && values?.packageType !== undefined;

      if (isValid) {
        const params = {
          package: values?.packageType,
          type: values?.type,
        };

        const response: any = await apiTopupService.getListRedeemPackage(params);

        setListItemPackage(response?.packages ?? []);
        setListItemPush(response?.pushPackage ?? []);
      }

      setInfoPickPackage(undefined);
      setIsWaringWallet(false);
    }
  };

  const handlePickPackge = (listingPackageId: number) => {
    setAllowBuyPush(false);

    const infoPackage = listItemPackage?.find((item) => item?.id === listingPackageId);

    const totalPoint =
      infoPackage?.discountedPoint > 0 ? infoPackage?.discountedPoint : infoPackage?.point;

    if (userPackage?.totalPoint < totalPoint) {
      setAmountNeedPayment(totalPoint - userPackage?.totalPoint);
      setIsWaringWallet(true);
    } else {
      setIsWaringWallet(false);
    }

    setInfoPickPackage({
      ...infoPackage,
      totalPoint: totalPoint,
      pointPackagePush: 0,
      listingPushPackageId: null,
    });
  };

  const onCalculatorPoint = (isSelectPush) => {
    setAllowBuyPush(isSelectPush);
    if (isSelectPush) {
      const infoPackageNew = {
        ...infoPickPackage,
        listingPushPackageId: listItemPush?.find(
          (item) => item.packageType === infoPickPackage?.packageType,
        )?.id,
        pointPackagePush: listItemPush?.find(
          (item) => item.packageType === infoPickPackage?.packageType,
        )?.point,
        totalPoint:
          (infoPickPackage?.discountedPoint > 0
            ? infoPickPackage?.discountedPoint
            : infoPickPackage?.point) +
          listItemPush?.find((item) => item.packageType === infoPickPackage?.packageType)?.point,
      };
      setInfoPickPackage(infoPackageNew);
      if (userPackage?.totalPoint < infoPackageNew.totalPoint) {
        setAmountNeedPayment(infoPackageNew.totalPoint - userPackage?.totalPoint);
        setIsWaringWallet(true);
      }
    } else {
      const infoPackageNew = {
        ...infoPickPackage,
        listingPushPackageId: null,
        pointPackagePush: 0,
        totalPoint: infoPickPackage?.totalPoint - infoPickPackage?.pointPackagePush,
      };

      setInfoPickPackage(infoPackageNew);

      if (userPackage?.totalPoint < infoPackageNew.totalPoint) {
        setAmountNeedPayment(infoPackageNew.totalPoint - userPackage?.totalPoint);
      }
    }
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

  if (isVisible && !isOpenedBefore) {
    return null;
  }

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
        maskClosable={false}
      >
        <div className="w-full">
          <Form form={formRef} layout="vertical">
            {!isMobile ? (
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-portal-primaryMainAdmin p-2">
                {/* Chọn loại, mua hay bán */}
                <div className="custom-select-radio col-span-12 rounded-full bg-white px-2">
                  <Form.Item name="type">
                    <Radio.Group
                      onChange={() => getListPackageInfo()}
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
                {/* Buy lượt post */}
                <div className="col-span-12 mt-2 grid grid-cols-10 rounded-3xl bg-white py-3 pt-10">
                  <div className="col-span-4 grid grid-cols-1 items-start px-6">
                    <div className="col-span-1">
                      <label className="text-base font-bold text-[#575757]">
                        {t('BuyPackModelSelectYoupackage')}
                      </label>
                      <Form.Item name="packageType">
                        <Select
                          className="w-full"
                          showSearch
                          onChange={() => getListPackageInfo()}
                          options={listPackageEnum?.map((x) => ({
                            value: x.id,
                            label: comm(x.name),
                            id: x.id,
                          }))}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="col-span-6 grid grid-cols-3">
                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[115px] w-[152px] flex-col items-center justify-end rounded-lg border border-[#CCCCCC] p-3">
                        <label className="font-medium text-[#575757]">{comm('Basic')}</label>
                        <br />
                        {listItemPackage?.find(
                          (item) => item?.packageType === packageListingEnum.Platinum,
                        )?.percentDecrease !== 0 && (
                          <label className="text-xs italic text-portal-rejectColor100 line-through">
                            {formatNumber(
                              listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Basic,
                              )?.point,
                            )}
                          </label>
                        )}
                        <label className="font-medium text-[#575757]">
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Basic,
                            )?.discountedPoint > 0
                              ? listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Basic,
                                )?.discountedPoint
                              : listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Basic,
                                )?.point,
                          )}
                        </label>
                        <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                          ( -
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Basic,
                            )?.percentDecrease,
                          )}
                          %)
                        </div>
                      </div>
                    </div>
                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[115px] w-[152px] flex-col items-center justify-end rounded-lg border border-[#CCCCCC] p-3">
                        {listItemPackage?.find(
                          (item) => item?.packageType === packageListingEnum.Gold,
                        )?.percentDecrease !== 0 && (
                          <label className="text-xs italic text-portal-rejectColor100 line-through">
                            {formatNumber(
                              listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Gold,
                              )?.point,
                            )}
                          </label>
                        )}
                        <div className="col-span-1 font-medium text-[#575757]">
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Gold,
                            )?.discountedPoint > 0
                              ? listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Gold,
                                )?.discountedPoint
                              : listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Gold,
                                )?.point,
                          )}
                        </div>
                        <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                          ( -
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Gold,
                            )?.percentDecrease ?? 0,
                          )}
                          %)
                        </div>

                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-center rounded-lg bg-[#F8D778] text-[#A67C00]">
                          <label className="font-medium">{comm('Gold')}</label>
                        </div>
                      </div>
                    </div>
                    <div className="relative col-span-1">
                      <div className="m-3 flex h-[115px] w-[152px] flex-col items-center justify-end rounded-lg border border-[#CCCCCC] p-3">
                        {listItemPackage?.find(
                          (item) => item?.packageType === packageListingEnum.Platinum,
                        )?.percentDecrease !== 0 && (
                          <label className="text-xs italic text-portal-rejectColor100 line-through">
                            {formatNumber(
                              listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Platinum,
                              )?.point,
                            )}
                          </label>
                        )}
                        <div className="col-span-1 font-medium text-[#575757]">
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Platinum,
                            )?.discountedPoint > 0
                              ? listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Platinum,
                                )?.discountedPoint
                              : listItemPackage?.find(
                                  (item) => item?.packageType === packageListingEnum.Platinum,
                                )?.point,
                          )}
                        </div>

                        <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                          (-
                          {formatNumber(
                            listItemPackage?.find(
                              (item) => item?.packageType === packageListingEnum.Platinum,
                            )?.percentDecrease ?? 0,
                          )}
                          %)
                        </div>
                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-center rounded-lg bg-[#DAD8D4] text-[#404040]">
                          <label className="font-medium">{comm('Platinum')}</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 grid grid-cols-1 items-start px-2"></div>

                  <Radio.Group
                    value={infoPickPackage?.id}
                    onChange={(value) => handlePickPackge(value.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                    size="middle"
                    className="col-span-6 grid grid-cols-3"
                  >
                    <div className='"col-span-1 m-3 mb-1 ml-2 flex w-[152px] items-center justify-center'>
                      <Radio.Button
                        className="w-[80px] !rounded-md text-center"
                        disabled={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Basic,
                          )?.id
                            ? false
                            : true
                        }
                        value={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Basic,
                          )?.id
                        }
                      >
                        {comm('Select')}
                      </Radio.Button>
                    </div>
                    <div className='"col-span-1 m-3 mb-1 ml-2 flex w-[152px] items-center justify-center'>
                      <Radio.Button
                        className="w-[80px] !rounded-md text-center"
                        disabled={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Gold,
                          )?.id
                            ? false
                            : true
                        }
                        value={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Gold,
                          )?.id
                        }
                      >
                        {comm('Select')}
                      </Radio.Button>
                    </div>
                    <div className='"col-span-1 m-3 mb-1 ml-2 flex w-[152px] items-center justify-center'>
                      <Radio.Button
                        disabled={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Platinum,
                          )?.id
                            ? false
                            : true
                        }
                        className="w-[80px] !rounded-md text-center"
                        value={
                          listItemPackage?.find(
                            (item) => item?.packageType === packageListingEnum.Platinum,
                          )?.id
                        }
                      >
                        {comm('Select')}
                      </Radio.Button>
                    </div>
                  </Radio.Group>
                  {/* Hidden package detail  */}
                  <>
                    <div className="col-span-4"></div>
                    <div className="col-span-6 mt-6 text-center">
                      <a
                        className="flex justify-center !text-[#1E854A] !underline"
                        onClick={() => setShowDetailPackage(!showDetailPackage)}
                      >
                        {comm('ViewMorDetail')} {collapseIcon}
                      </a>
                    </div>

                    <div
                      className={`${showDetailPackage ? 'block' : 'hidden'} col-span-4 grid grid-cols-1`}
                    >
                      <div className="relative col-span-1 m-3 flex flex-col p-3">
                        <div className="my-4 h-[80px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_1')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_1')}
                          </p>
                        </div>
                        <div className="mb-3 h-[80px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {' '}
                            {t('PopupBuyBackPackageTitle_2')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_2')}
                          </p>
                        </div>
                        <div className="mb-3 h-[60px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_Extra')}
                          </p>
                        </div>
                        <div className="mb-3 h-[60px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_3')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_3')}
                          </p>
                        </div>
                        <div className="mb-3 h-[60px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_4')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_4')}
                          </p>
                        </div>
                        <div className="mb-3 h-[80px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_5')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_5')}
                          </p>
                        </div>
                        <div className="mb-3 h-[80px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_6')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_6')}
                          </p>
                        </div>
                        <div className="mb-3 h-[80px] w-full">
                          <p className="text-end font-semibold text-portal-textColorAdmin">
                            {t('PopupBuyBackPackageTitle_7')}
                          </p>
                          <p className="text-end text-xs text-[#0C1419]">
                            {t('PopupBuyBackPackageDescription_7')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${showDetailPackage ? 'block' : 'hidden'} col-span-6 grid grid-cols-3`}
                    >
                      {/* // Package Basic */}
                      <div className="relative col-span-1 m-3 flex w-[152px] flex-col items-center rounded-lg border border-[#CCCCCC] p-3">
                        <div className="my-4 h-[80px] font-semibold">
                          {comm('TotalDays', {
                            total: maxNumberPublicDate,
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">{comm('UnderGold')}</div>
                        <div className="mb-3 flex h-[60px] font-semibold">{t('Type_Basic')}</div>
                        <div className="mb-3 flex h-[60px] font-semibold">20</div>
                        <div className="mb-3 flex h-[60px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">
                          {comm('TimeOnPost', {
                            total: '5',
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-portal-red">
                          {comm('No')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                      </div>
                      {/* // Package Gold */}
                      <div className="relative col-span-1 m-3 flex w-[152px] flex-col items-center rounded-lg border border-[#CCCCCC] p-3">
                        <div className="my-4 h-[80px] font-semibold">
                          {comm('TotalDays', {
                            total: maxNumberPublicDate,
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">
                          {comm('UnderPlatinum')}
                        </div>
                        <div className="mb-3 flex h-[60px] font-semibold">{t('Type_Medium')}</div>
                        <div className="mb-3 flex h-[60px] font-semibold">20</div>
                        <div className="mb-3 flex h-[60px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">
                          {comm('TimeOnPost', {
                            total: '8',
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-portal-red">
                          {comm('No')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                      </div>
                      {/* // Package Plantinum */}
                      <div className="relative col-span-1 m-3 flex w-[152px] flex-col items-center rounded-lg border border-[#CCCCCC] p-3">
                        <div className="my-4 h-[80px] font-semibold">
                          {comm('TotalDays', {
                            total: maxNumberPublicDate,
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">{comm('TopOfList')}</div>
                        <div className="mb-3 flex h-[60px] font-semibold">{t('Type_Large')}</div>
                        <div className="mb-3 flex h-[60px] font-semibold">30</div>
                        <div className="mb-3 flex h-[60px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold">
                          {comm('TimeOnPost', {
                            total: '8',
                          })}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                        <div className="mb-3 flex h-[80px] font-semibold text-[#1E854A]">
                          {comm('Yes')}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
                {/* Buy lượt push */}
                <div className="col-span-12 mt-2 grid grid-cols-10 rounded-3xl bg-white px-4 py-8">
                  <div className="col-span-4 grid grid-cols-1 items-start">
                    <div className="col-span-1">
                      <Switch value={allowBuyPush} onClick={(value) => onCalculatorPoint(value)} />
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
                            listItemPush?.find(
                              (item) => item?.packageType === packageListingEnum.Gold,
                            )?.point,
                          )}
                        </div>

                        <Button
                          disabled={
                            infoPickPackage?.packageType === packageListingEnum.Basic ? false : true
                          }
                          className={`${
                            infoPickPackage?.packageType === packageListingEnum.Basic
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
                            listItemPush?.find(
                              (item) => item?.packageType === packageListingEnum.Gold,
                            )?.point,
                          )}
                        </div>
                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#F8D778] text-[#A67C00]">
                          {comm('Gold')}
                        </div>
                        <Button
                          disabled={
                            infoPickPackage?.packageType === packageListingEnum.Gold ? false : true
                          }
                          className={`${
                            infoPickPackage?.packageType === packageListingEnum.Gold
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
                            listItemPush?.find(
                              (item) => item?.packageType === packageListingEnum.Gold,
                            )?.point,
                          )}
                        </div>
                        <div className="absolute left-[50px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#DAD8D4] text-[#404040]">
                          {comm('Platinum')}
                        </div>
                        <Button
                          disabled={
                            infoPickPackage?.packageType === packageListingEnum.Platinum
                              ? false
                              : true
                          }
                          className={`${
                            infoPickPackage?.packageType === packageListingEnum.Platinum
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

                  {/* gói tin */}
                  <div className="col-span-10 mb-3 grid grid-cols-10">
                    <div className="col-span-7 mb-3 font-semibold text-[#505050]">
                      {comm('ListingPackage')}
                    </div>
                    <div className="col-span-3 mb-3 font-semibold text-[#505050]">
                      {infoPickPackage?.package &&
                        comm(
                          listPackage?.find((item) => item.id === infoPickPackage?.packageType)
                            ?.name,
                        )}
                    </div>
                    <div className="col-span-7 mb-3">
                      {infoPickPackage?.packageType &&
                        comm(
                          listPackageEnum.find((item) => item.id === infoPickPackage?.package)
                            ?.name,
                        )}
                    </div>
                    <div className="col-span-3 mb-3 grid grid-cols-2">
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {formatNumber(
                          infoPickPackage?.discountedPoint > 0
                            ? infoPickPackage?.discountedPoint
                            : infoPickPackage?.point,
                        )}
                      </div>
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {t('EcomListPackageDetailListingPoint')}
                      </div>
                    </div>
                  </div>
                  {/* goi push */}
                  {allowBuyPush && (
                    <div className="col-span-10 grid grid-cols-10">
                      <div className="col-span-10 mb-3 font-semibold text-[#505050]">
                        {comm('PushLisingPackage')}
                      </div>
                      <div className="col-span-7 mb-3">
                        {comm('TurnPush', {
                          total: formatNumber(
                            listItemPush?.find(
                              (item) => item.packageType === infoPickPackage?.packageType,
                            )?.numberOfPush,
                          ),
                        })}
                      </div>
                      <div className="col-span-3 mb-3 grid grid-cols-2">
                        <div className="col-span-1 font-medium text-[#2C2C2C]">
                          {formatNumber(infoPickPackage?.pointPackagePush ?? 0)}
                        </div>
                        <div className="col-span-1 font-medium text-[#2C2C2C]">
                          {' '}
                          {t('EcomListPackageDetailListingPoint')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* total */}
                  <div className="col-span-12 border-t border-portal-primaryButtonAdmin"></div>
                  <div className="col-span-10 grid grid-cols-10 py-2">
                    <div className="text-portal-primaryMainAdmintext-base col-span-7 text-base font-medium text-portal-primaryMainAdmin">
                      {t('EcomPackagePushTotalPoint')}
                    </div>
                    <div className="text-portal-primaryMainAdmintext-base col-span-3 grid grid-cols-2 text-base font-medium text-portal-primaryMainAdmin">
                      <div className="col-span-1">{formatNumber(infoPickPackage?.totalPoint)}</div>
                      <div className="col-span-1">{t('EcomListPackageDetailListingPoint')}</div>
                    </div>
                  </div>
                  <div className="col-span-12">{t('NoteTimeUsePackge')}</div>
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
                      {/* //TODO: MỞ COMMENT KHI CHO THANH TOÁN ONLINE */}
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
                      disabled={!infoPickPackage || isWaringWallet}
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
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white px-2">
                  <div className="custom-select-radio col-span-12 rounded-full py-3">
                    <Form.Item name="type">
                      <Radio.Group
                        onChange={() => getListPackageInfo()}
                        optionType="button"
                        buttonStyle="solid"
                        size="middle"
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
                  <div className="col-span-12">
                    <Form.Item name="packageType" label={t('BuyPackModelSelectYoupackage')}>
                      <Select
                        className="w-full"
                        showSearch
                        onChange={() => getListPackageInfo()}
                        options={listPackageEnum?.map((x) => ({
                          value: x.id,
                          label: comm(x.name),
                          id: x.id,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-12 my-4 grid grid-cols-6">
                    <div className="col-span-6 text-center">
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
                            <div className="my-[20px] flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                              <label className="font-medium text-[#575757]">{comm('Basic')}</label>
                              {listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Basic,
                              )?.percentDecrease !== 0 && (
                                <div className="col-span-1 text-xs italic text-portal-rejectColor100 line-through">
                                  {formatNumber(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Basic,
                                    )?.point,
                                  )}
                                </div>
                              )}
                              <div className="col-span-1">
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Basic,
                                  )?.discountedPoint > 0
                                    ? listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Basic,
                                      )?.discountedPoint
                                    : listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Basic,
                                      )?.point,
                                )}
                              </div>
                              <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                                ( -
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Basic,
                                  )?.percentDecrease ?? 0,
                                )}
                                %)
                              </div>
                              <Button
                                onClick={() =>
                                  handlePickPackge(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Basic,
                                    )?.id,
                                  )
                                }
                                className={`${
                                  infoPickPackage?.packageType === packageListingEnum.Basic
                                    ? 'bg-portal-primaryButtonAdmin text-white'
                                    : 'border border-[#B8B9B9] bg-white'
                                } w-[80px] !rounded-md text-center`}
                              >
                                {comm('Select')}
                              </Button>
                            </div>
                          </div>
                          {/* Hidden package detail  */}
                          <>
                            <div className="mt-3 flex w-full justify-center">
                              <Button
                                type="link"
                                className="!text-[#1E854A] !underline"
                                onClick={() => setShowDetailPackage(!showDetailPackage)}
                              >
                                {comm('ViewMorDetail')} {collapseIcon}
                              </Button>
                            </div>

                            <div className={`${showDetailPackage ? 'block' : 'hidden'} px-[5%]`}>
                              <div className="mb-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_1')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('TotalDays', {
                                    total: maxNumberPublicDate,
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_1')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_2')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('UnderGold')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_2')}
                                </p>
                              </div>
                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_Extra')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {t('Type_Basic')}
                                </p>
                              </div>
                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_3')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  20
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_3')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_4')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('No')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_4')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_5')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('TimeOnPost', {
                                    total: '5',
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_5')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_6')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('No')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_6')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_7')}</p>
                                <p className="text-center font-semibold text-[#1E854A]">
                                  {comm('Yes')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_7')}
                                </p>
                              </div>
                            </div>
                          </>
                        </div>

                        <div className="col-span-1">
                          <div className="flex w-full justify-center">
                            <div className="relative my-[20px] flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                              <label className="font-medium text-white">{comm('Gold')}</label>
                              {listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Gold,
                              )?.percentDecrease !== 0 && (
                                <div className="col-span-1 text-xs italic text-portal-rejectColor100 line-through">
                                  {formatNumber(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Gold,
                                    )?.point,
                                  )}
                                </div>
                              )}
                              <div className="col-span-1">
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Gold,
                                  )?.discountedPoint > 0
                                    ? listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Gold,
                                      )?.discountedPoint
                                    : listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Gold,
                                      )?.point,
                                )}
                              </div>
                              <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                                ( -
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Gold,
                                  )?.percentDecrease ?? 0,
                                )}
                                %)
                              </div>
                              <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#F8D778] text-[#A67C00]">
                                {comm('Gold')}
                              </div>
                              <Button
                                onClick={() =>
                                  handlePickPackge(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Gold,
                                    )?.id,
                                  )
                                }
                                className={`${
                                  infoPickPackage?.packageType === packageListingEnum.Gold
                                    ? 'bg-portal-primaryButtonAdmin text-white'
                                    : 'border border-[#B8B9B9] bg-white'
                                } w-[80px] !rounded-md text-center`}
                              >
                                {comm('Select')}
                              </Button>
                            </div>
                          </div>
                          {/* Hidden package detail  */}
                          <>
                            <div className="mt-3 flex w-full justify-center">
                              <Button
                                type="link"
                                className="!text-[#1E854A] !underline"
                                onClick={() => setShowDetailPackage(!showDetailPackage)}
                              >
                                {comm('ViewMorDetail')} {collapseIcon}
                              </Button>
                            </div>

                            <div className={`${showDetailPackage ? 'block' : 'hidden'} px-[5%]`}>
                              <div className="mb-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_1')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('TotalDays', {
                                    total: maxNumberPublicDate,
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_1')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_2')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('UnderGold')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_2')}
                                </p>
                              </div>
                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_Extra')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {t('Type_Medium')}
                                </p>
                              </div>
                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_3')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  20
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_3')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_4')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('No')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_4')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_5')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('TimeOnPost', {
                                    total: '5',
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_5')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_6')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('No')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_6')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_7')}</p>
                                <p className="text-center font-semibold text-[#1E854A]">
                                  {comm('Yes')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_7')}
                                </p>
                              </div>
                            </div>
                          </>
                        </div>

                        <div className="col-span-1">
                          <div className="flex w-full justify-center">
                            <div className="relative my-[20px] flex h-[174px] w-[152px] flex-col items-center justify-evenly rounded-lg border border-[#CCCCCC] p-3">
                              <label className="font-medium text-white">{comm('Platinum')}</label>
                              {listItemPackage?.find(
                                (item) => item?.packageType === packageListingEnum.Platinum,
                              )?.percentDecrease !== 0 && (
                                <div className="col-span-1 text-xs italic text-portal-rejectColor100 line-through">
                                  {formatNumber(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Platinum,
                                    )?.point,
                                  )}
                                </div>
                              )}
                              <div className="col-span-1">
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Platinum,
                                  )?.discountedPoint > 0
                                    ? listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Platinum,
                                      )?.discountedPoint
                                    : listItemPackage?.find(
                                        (item) => item?.packageType === packageListingEnum.Platinum,
                                      )?.point,
                                )}
                              </div>
                              <div className="col-span-1 text-xs font-semibold text-portal-primaryMainAdmin">
                                ( -
                                {formatNumber(
                                  listItemPackage?.find(
                                    (item) => item?.packageType === packageListingEnum.Platinum,
                                  )?.percentDecrease ?? 0,
                                )}
                                %)
                              </div>
                              <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#DAD8D4] text-[#404040]">
                                {comm('Platinum')}
                              </div>
                              <Button
                                onClick={() =>
                                  handlePickPackge(
                                    listItemPackage?.find(
                                      (item) => item?.packageType === packageListingEnum.Platinum,
                                    )?.id,
                                  )
                                }
                                className={`${
                                  infoPickPackage?.packageType === packageListingEnum.Platinum
                                    ? 'bg-portal-primaryButtonAdmin text-white'
                                    : 'border border-[#B8B9B9] bg-white'
                                } w-[80px] !rounded-md text-center`}
                              >
                                {comm('Select')}
                              </Button>
                            </div>
                          </div>

                          {/* Hidden package detail  */}
                          <>
                            <div className="mt-3 flex w-full justify-center">
                              <Button
                                type="link"
                                className="!text-[#1E854A] !underline"
                                onClick={() => setShowDetailPackage(!showDetailPackage)}
                              >
                                {comm('ViewMorDetail')} {collapseIcon}
                              </Button>
                            </div>

                            <div className={`${showDetailPackage ? 'block' : 'hidden'} px-[5%]`}>
                              <div className="mb-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_1')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('TotalDays', {
                                    total: maxNumberPublicDate,
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_1')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_2')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {comm('UnderGold')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_2')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_Extra')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  {t('Type_Large')}
                                </p>
                              </div>
                              <div className="my-3 w-full">
                                <p className="text-center text-portal-textColorAdmin">
                                  {t('PopupBuyBackPackageTitle_3')}
                                </p>
                                <p className="text-center font-semibold text-portal-textColorAdmin">
                                  20
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_3')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_4')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('No')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_4')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_5')}</p>
                                <p className="text-center font-semibold text-portal-red">
                                  {comm('TimeOnPost', {
                                    total: '8',
                                  })}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_5')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_6')}</p>
                                <p className="text-center font-semibold text-[#1E854A]">
                                  {comm('Yes')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_6')}
                                </p>
                              </div>

                              <div className="my-3 w-full">
                                <p className="text-center">{t('PopupBuyBackPackageTitle_7')}</p>
                                <p className="text-center font-semibold text-[#1E854A]">
                                  {comm('Yes')}
                                </p>
                                <p className="text-center text-xs">
                                  {t('PopupBuyBackPackageDescription_7')}
                                </p>
                              </div>
                            </div>
                          </>
                        </div>
                      </Carousel>
                    </div>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-2">
                  <div className="col-span-12">
                    <Switch value={allowBuyPush} onClick={(value) => onCalculatorPoint(value)} />
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
                                listItemPush?.find(
                                  (item) => item?.packageType === packageListingEnum.Basic,
                                )?.point,
                              )}
                            </div>

                            <Button
                              disabled={
                                infoPickPackage?.packageType === packageListingEnum.Basic
                                  ? false
                                  : true
                              }
                              className={`${
                                infoPickPackage?.packageType === packageListingEnum.Basic
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
                                listItemPush?.find(
                                  (item) => item?.packageType === packageListingEnum.Gold,
                                )?.point,
                              )}
                            </div>
                            <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#F8D778] text-[#A67C00]">
                              {comm('Gold')}
                            </div>
                            <Button
                              disabled={
                                infoPickPackage?.packageType === packageListingEnum.Gold
                                  ? false
                                  : true
                              }
                              className={`${
                                infoPickPackage?.packageType === packageListingEnum.Gold
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
                                listItemPush?.find(
                                  (item) => item?.packageType === packageListingEnum.Platinum,
                                )?.point,
                              )}
                            </div>
                            <div className="absolute left-[40px] top-[-20px] flex h-[68px] w-[68px] items-center justify-evenly rounded-lg bg-[#DAD8D4] text-[#404040]">
                              {comm('Platinum')}
                            </div>
                            <Button
                              disabled={
                                infoPickPackage?.packageType === packageListingEnum.Platinum
                                  ? false
                                  : true
                              }
                              className={`${
                                infoPickPackage?.packageType === packageListingEnum.Platinum
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

                  {/* gói tin */}
                  <div className="col-span-10 mb-3 grid grid-cols-10">
                    <div className="col-span-5 mb-3 font-semibold text-[#505050]">
                      {comm('ListingPackage')}
                    </div>
                    <div className="col-span-5 mb-3 font-medium text-[#2C2C2C]">
                      {infoPickPackage?.package &&
                        comm(
                          listPackage?.find((item) => item.id === infoPickPackage?.packageType)
                            ?.name,
                        )}
                    </div>
                    <div className="col-span-5 mb-3">
                      {infoPickPackage?.packageType &&
                        comm(
                          listPackageEnum.find((item) => item.id === infoPickPackage?.package)
                            ?.name,
                        )}
                    </div>
                    <div className="col-span-5 mb-3 grid grid-cols-2">
                      <div className="col-span-1 font-medium text-[#2C2C2C]">
                        {formatNumber(
                          infoPickPackage?.discountedPoint > 0
                            ? infoPickPackage?.discountedPoint
                            : infoPickPackage?.point,
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end font-medium text-[#2C2C2C]">
                        {t('EcomListPackageDetailListingPoint')}
                      </div>
                    </div>
                  </div>
                  {/* goi púh */}
                  {allowBuyPush && (
                    <div className="col-span-10 grid grid-cols-10">
                      <div className="col-span-10 mb-3 font-semibold text-[#505050]">
                        {comm('PushLisingPackage')}
                      </div>
                      <div className="col-span-5 mb-3">
                        {comm('TurnPush', {
                          total: formatNumber(
                            listItemPush?.find(
                              (item) => item.packageType === infoPickPackage?.packageType,
                            )?.numberOfPush,
                          ),
                        })}
                      </div>
                      <div className="col-span-5 mb-3 grid grid-cols-2">
                        <div className="col-span-1 font-medium text-[#2C2C2C]">
                          {formatNumber(infoPickPackage?.pointPackagePush ?? 0)}
                        </div>
                        <div className="col-span-1 flex justify-end font-medium text-[#2C2C2C]">
                          {t('EcomListPackageDetailListingPoint')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* total */}
                  <div className="col-span-12 border-t border-portal-primaryButtonAdmin"></div>
                  <div className="col-span-10 grid grid-cols-10 py-2">
                    <div className="text-portal-primaryMainAdmintext-base col-span-5 text-start font-medium text-portal-primaryMainAdmin">
                      {t('EcomPackagePushTotalPoint')}
                    </div>
                    <div className="text-portal-primaryMainAdmintext-base col-span-5 grid grid-cols-2 text-sm font-medium text-portal-primaryMainAdmin">
                      <div className="col-span-1">{formatNumber(infoPickPackage?.totalPoint)}</div>
                      <div className="col-span-1 flex justify-end">
                        {t('EcomListPackageDetailListingPoint')}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">{t('NoteTimeUsePackge')}</div>
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
                  <div className="mb-2 mt-1 rounded-2xl bg-[#FEECE3] p-2">
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

                <div className="mb-2 mt-2 flex flex-wrap justify-end rounded-2xl bg-white p-3">
                  <Button
                    className={`mt-1 w-full !bg-portal-gray-2 text-sm !text-portal-black lg:w-fit`}
                    onClick={handleCloseModal}
                  >
                    {comm('Cancel')}
                  </Button>

                  {isWaringWallet ? (
                    <>
                      {/* //TODO: MỞ COMMENT KHI CHO THANH TOÁN ONLINE */}
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
                      disabled={!infoPickPackage || isWaringWallet}
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
          <style scoped>
            {`
            .custom-select-radio {
  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background-color: #ffd14b !important;
    border-color: #ffd14b !important;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent !important;
  }
}

.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  background-color: #ffd14b !important;
  border-color: #ffd14b !important;
}


            `}
          </style>
        </div>
      </Modal>
      <TopupModal
        isVisible={isTopupOpen}
        closeModal={() => {
          setIsTopupOpen(false);
        }}
        formRef={formRefTopup}
      />
    </>
  );
};

export default BuyPackageModal;
