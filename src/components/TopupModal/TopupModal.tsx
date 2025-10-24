'use client';
import apiTopupService from '@/apiServices/externalApiServices/apiTopupService';
import logoHT from '@/assets/icon/logo-hungthai.svg';
import cardATM from '@/assets/images/cardATM.svg';
import cardQR from '@/assets/images/cardQR.svg';
import cardQuocTe from '@/assets/images/cardQuocte.svg';
import { codePaymentPayme } from '@/libs/appconst';
import { formatNumber, tinhSoTienTruocThue } from '@/libs/helper';
import { Button, Checkbox, Form, Radio } from 'antd';
import Modal from 'antd/es/modal';
import { useLocale, useTranslations } from 'next-intl';

import SystemConfigFeeService from '@/apiServices/externalApiServices/systemConfigFeeServices';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import _ from 'lodash';
import { useRouter } from 'next-intl/client';
import Image from 'next/image';
import React, { useEffect, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';
import FormFloatNumber from '../FormInput/formNumber';

const listItemPayment = [
  {
    value: 'CREDITCARD',
    label: 'CREDITCARD',
    image: cardQuocTe,
  },
  {
    value: 'ATMCARD',
    label: 'ATMCARD',
    image: cardATM,
  },

  {
    value: 'VIETQR',
    label: 'VIETQR',
    image: cardQR,
  },
];

const TopupModal = ({ isVisible, closeModal, formRef }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const error = useTranslations('error');
  const locale = useLocale();
  const success = useTranslations('successNotifi');
  const errorNotifi = useTranslations('errorNotifi');
  const [textNote, setTextNote] = useState(undefined);
  const { push } = useRouter();

  const { allSettingLandingPage } = useAllSettingLandingPage();

  const [listpaymentConfig, setListpaymentConfig] = useState<any[]>([]);

  const [isPending, startTransition] = useTransition();
  const [currentFeeVAT, setCurrentFeeVAT] = useState<any>(undefined);

  const [configAmonutTopup, setConfigAmonutTopup] = useState({
    minAmount: 0,
    maxAmount: 0,
  });

  useEffect(() => {
    if (isVisible) {
      setTextNote(formRef.getFieldValue('totalAmount'));
      // getConfigFeePayment();
      getCurrentFeeVAT();

      if (allSettingLandingPage) {
        setConfigAmonutTopup({
          minAmount: _.find(allSettingLandingPage, { key: 'MIN_AMOUNT_PAYMENT' }).value,
          maxAmount: _.find(allSettingLandingPage, { key: 'MAX_AMOUNT_PAYMENT' }).value,
        });
      }
    }
  }, [isVisible]);

  // const getConfigFeePayment = async () => {
  //   const listConfigFee = await apiTopupService.GetListFeeConfig();

  //   setListpaymentConfig(listConfigFee);
  // };

  const getCurrentFeeVAT = async () => {
    const currentFeeVAT = await SystemConfigFeeService.getCurrentFeeVAT();

    setCurrentFeeVAT(currentFeeVAT);
  };

  // const onChangeFeeConfig = (configSelect) => {
  //   setItemConfig(listpaymentConfig.find((item) => item?.paymentMethod === configSelect));
  // };

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };
  const handleCloseModal = () => {
    formRef.resetFields();
    setTextNote(undefined);
    // setItemConfig(undefined);
    closeModal();
  };

  const handleTopup = async () => {
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
    if (values?.totalAmount < configAmonutTopup.minAmount) {
      return notify(
        'error',
        error('minTopup', {
          amount: formatNumber(configAmonutTopup.minAmount),
        }),
      );
    } else if (values?.totalAmount > configAmonutTopup.maxAmount) {
      return notify(
        'error',
        error('maxTopup', {
          amount: formatNumber(configAmonutTopup.maxAmount),
        }),
      );
    } else {
      const body = {
        ...values,
        successfullyUrl: `${locale}/payment/success`,
        FailedUrl: `${locale}/payment/fail`,
      };
      startTransition(async () => {
        const res = await apiTopupService.createOrderPayment(body);
        if (res.code === codePaymentPayme.createOk) {
          notify('success', success('paymentGotoLink'));
          // Mở tab mới

          push(res.url);
          setTextNote(undefined);
          formRef.resetFields();
          closeModal();
        } else {
          return notify('error', res?.message);
        }
      });
    }
  };

  return (
    <Modal
      style={{ borderRadius: '0px' }}
      className="z-[8888]"
      styles={{
        wrapper: {
          background: 'none',
        },
        content: {
          padding: isMobile ? '4px 8px 4px 8px' : '25px 32px 32px 32px',
          borderRadius: '20px',
          background: '#D4DFD1',
          boxShadow: 'none',
        },
      }}
      open={isVisible}
    
      onCancel={handleCloseModal}
      footer={null}
      width={'1040px'}
      closable={false}
      maskClosable={false}
    >
      <div className="flex flex-col rounded-2xl">
        <div className="flex items-center justify-center py-2">
          <Image className="object-cover" src={logoHT} alt="logoHT" />
        </div>
        <div className="w-full">
          <Form form={formRef} layout="vertical">
            {!isMobile ? (
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-3">
                <div className="col-span-6 grid grid-cols-12">
                  <div className="col-span-12 pt-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('TopupModalInfo')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatNumber
                      step={1000}
                      precision={0}
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseInput')} ${t('TopupModalAmount')}`,
                        },
                      ]}
                      name="totalAmount"
                      onChange={(value) => setTextNote(value)}
                      required
                      label={t('TopupModalInputAmount')}
                    />
                  </div>
                  <div className="col-span-12 grid grid-cols-2">
                    <div className="col-span-1">
                      <label>{t('numberPointYouReceive')}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteTopupAmountToPoint', {
                          totalAmount: formatNumber(textNote) ?? 0,
                        })}
                      </label>
                    </div>
                  </div>
                  <div className="col-span-12 pt-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('InfoTopupPayment')}
                    </label>
                  </div>
                  <div className="col-span-12 grid grid-cols-2">
                    <div className="col-span-1">
                      <label>{t('NumberCashPayment')}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteAmountToPointPayment', {
                          totalAmount: formatNumber(
                            Math.round(
                              textNote - tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount),
                            ),
                          ),
                        })}
                      </label>
                    </div>
                    <div className="col-span-1">
                      <label>{`VAT (${currentFeeVAT?.vatAmount ?? 0} %)`}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteAmountToPointPayment', {
                          totalAmount:
                            formatNumber(
                              Math.round(tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount)),
                            ) ?? 0,
                        })}
                      </label>
                    </div>

                    <div className="col-span-1 mt-2">
                      <label className="font-semibold">{t('totalAmountTopupPayment')}</label>
                    </div>
                    <div className="col-span-1 mt-2 flex justify-end">
                      <label className="font-semibold">
                        {t('noteAmountToPointPayment', {
                          totalAmount: formatNumber(textNote) ?? 0,
                        })}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 grid grid-cols-12">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('paymentMethod')}
                    </label>
                  </div>
                  <div className="col-span-12 rounded-full bg-white px-2">
                    <Form.Item
                      name="paymentMethod"
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t('paymentMethod')}`,
                        },
                      ]}
                    >
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        size="middle"
                        className="grid grid-cols-3 px-3"
                        // onChange={(value) => onChangeFeeConfig(value.target.value)}
                      >
                        {listItemPayment.map((item) => (
                          <Radio
                            className="col-span-1 ml-2 mt-2 flex h-[156px] w-[126px] items-center justify-center !rounded-md"
                            value={item?.value}
                          >
                            <Image
                              alt="logoHT"
                              src={item?.image}
                              className="object-cover"
                              width={120}
                              height={120}
                            />
                            <label className="flex justify-center font-bold !text-black">
                              {comm(item?.label)}
                            </label>
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>

                <div className="col-span-12 mt-2 border-t border-portal-primaryButtonAdmin">
                  {t('NoteTimeUsePoint')}
                </div>
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
                <div className="col-span-12 flex justify-end">
                  <Button
                    className={`!bg-portal-gray-2 text-sm !text-portal-black`}
                    onClick={handleCloseModal}
                  >
                    {comm('Cancel')}
                  </Button>
                  <Button
                    loading={isPending}
                    className={`ml-2 !bg-portal-primaryButtonAdmin text-sm !text-portal-black`}
                    onClick={handleTopup}
                  >
                    {comm('Payment')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-2">
                <div className="col-span-12 grid grid-cols-12">
                  <div className="col-span-12 pt-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('TopupModalInfo')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatNumber
                      precision={0}
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseInput')} ${t('TopupModalAmount')}`,
                        },
                      ]}
                      name="totalAmount"
                      onChange={(value) => setTextNote(value)}
                      required
                      label={t('TopupModalInputAmount')}
                    />
                  </div>
                  <div className="col-span-12 grid grid-cols-2">
                    <div className="col-span-1">
                      <label>{t('numberPointYouReceive')}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteTopupAmountToPoint', {
                          totalAmount: formatNumber(textNote) ?? 0,
                        })}
                      </label>
                    </div>
                  </div>
                  <div className="col-span-12 pt-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('InfoTopupPayment')}
                    </label>
                  </div>
                  <div className="col-span-12 grid grid-cols-2">
                    <div className="col-span-1">
                      <label>{t('NumberCashPayment')}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteAmountToPointPayment', {
                          totalAmount: formatNumber(
                            Math.round(
                              textNote - tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount),
                            ),
                          ),
                        })}
                      </label>
                    </div>
                    <div className="col-span-1">
                      <label>{`VAT (${currentFeeVAT?.vatAmount ?? 0} %)`}</label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <label>
                        {t('noteAmountToPointPayment', {
                          totalAmount:
                            formatNumber(
                              Math.round(tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount)),
                            ) ?? 0,
                        })}
                      </label>
                    </div>

                    <div className="col-span-1 mt-2">
                      <label className="font-semibold">{t('totalAmountTopupPayment')}</label>
                    </div>
                    <div className="col-span-1 mt-2 flex justify-end">
                      <label className="font-semibold">
                        {t('noteAmountToPointPayment', {
                          totalAmount: formatNumber(textNote) ?? 0,
                        })}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 grid grid-cols-12">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('paymentMethod')}
                    </label>
                  </div>
                  <div className="col-span-12 rounded-full bg-white px-2">
                    <Form.Item
                      name="paymentMethod"
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t('paymentMethod')}`,
                        },
                      ]}
                    >
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        size="middle"
                        className="grid grid-cols-3 px-3"
                        // onChange={(value) => onChangeFeeConfig(value.target.value)}
                      >
                        {listItemPayment.map((item) => (
                          <Radio
                            className="col-span-1 ml-2 mt-2 flex h-[100px] w-[90px] items-center justify-center gap-x-1 !rounded-md"
                            value={item?.value}
                          >
                            <Image
                              alt="logoHT"
                              src={item?.image}
                              className="object-cover"
                              width={60}
                              height={60}
                            />
                            <label className="flex justify-center text-xs font-bold !text-black">
                              {comm(item?.label)}
                            </label>
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                    <div className="col-span-12">{t('NoteTimeUsePoint')}</div>
                    <div className="col-span-12">
                      <Form.Item name="isAllowPayment" valuePropName="checked">
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
                        <Checkbox type="checkbox">{t('IAgreeWithNote')}</Checkbox>
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 flex justify-end">
                  <Button
                    className={`!bg-portal-gray-2 text-sm !text-portal-black`}
                    onClick={handleCloseModal}
                  >
                    {comm('Cancel')}
                  </Button>
                  <Button
                    loading={isPending}
                    className={`ml-2 !bg-portal-primaryButtonAdmin text-sm !text-portal-black`}
                    onClick={handleTopup}
                  >
                    {comm('Payment')}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </div>
      <></>
    </Modal>
  );
};

export default TopupModal;
