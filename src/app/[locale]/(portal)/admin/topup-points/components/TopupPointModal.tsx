'use client';
import apiPaymentService from '@/apiServices/externalApiServices/apiPaymentService';
import SystemConfigFeeService from '@/apiServices/externalApiServices/systemConfigFeeServices';
import logoHT from '@/assets/icon/logo-hungthai.svg';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import {
  checkPermissonAcion,
  convertPhoneNumber,
  formatNumber,
  tinhSoTienTruocThue,
} from '@/libs/helper';
import { MemberTopupModel } from '@/models/memberModel/memberTopupModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form } from 'antd';
import Modal from 'antd/es/modal';
import _, { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

interface TopupModalProps {
  closeModal: (isReload: boolean) => void;
  isVisible: boolean;
}

const TopupPointModal: React.FC<TopupModalProps> = ({ isVisible, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [isPending, startTransition] = useTransition();

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const error = useTranslations('error');
  const success = useTranslations('successNotifi');
  const [textNote, setTextNote] = useState<number>(0);
  const { userInfo } = useGlobalStore();

  const [formRef] = Form.useForm();

  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [urlLinkLogo, setUrlLinkLogo] = useState('');

  const [listUser, setListUser] = useState<MemberTopupModel[]>([]);

  const [currentFeeVAT, setCurrentFeeVAT] = useState<any>(undefined);

  const [configAmonutTopup, setConfigAmonutTopup] = useState({
    minAmount: 0,
    maxAmount: 0,
  });

  useEffect(() => {
    if (isVisible) {
      if (allSettingLandingPage) {
        let find = _.find(allSettingLandingPage, { key: 'LOGO_LANDING_PAGE' });
        if (find) {
          setUrlLinkLogo(find.value);
        }
        setConfigAmonutTopup({
          minAmount: _.find(allSettingLandingPage, { key: 'MIN_AMOUNT_PAYMENT' }).value,
          maxAmount: _.find(allSettingLandingPage, { key: 'MAX_AMOUNT_PAYMENT' }).value,
        });
      }

      getListmember('');
      getCurrentFeeVAT();
    }
  }, [isVisible]);

  const getListmember = debounce(async (keyword: string) => {
    const numberSearch = convertPhoneNumber(keyword);

    const membersResponse = await apiPaymentService.getAutoCompleteClient(numberSearch);

    setListUser(membersResponse.data);
  }, 300);

  const getCurrentFeeVAT = async () => {
    const currentFeeVAT = await SystemConfigFeeService.getCurrentFeeVAT();
    setCurrentFeeVAT(currentFeeVAT);
  };

  const handleShowName = (id?: number) => {
    if (id) {
      formRef.setFieldValue('nameShow', id);
    } else {
      formRef.setFieldValue('nameShow', null);
    }
  };

  const handleCloseModal = (isReload) => {
    closeModal(isReload);
    formRef.resetFields();
  };

  const handleTopup = async () => {
    await formRef.validateFields();

    const values = formRef.getFieldsValue();

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
      startTransition(async () => {
        const body = {
          ...values,
          vatAmount: textNote - Math.round(textNote / 1.1),
          baseAmount: Math.round(textNote / 1.1),
        };

        try {
          await apiPaymentService.topupPoint4user(body);
          notify('success', success('updateAPI'));
          handleCloseModal(true);
        } catch (e) {
          console.log('');
        }
      });
    }
  };

  return (
    <Modal
      style={{ borderRadius: '0px' }}
      styles={{
        wrapper: {
          background: 'none',
        },
        content: {
          padding: '8px 8px 8px 8px',
          borderRadius: '20px',
          background: '#D4DFD1',
          boxShadow: 'none',
        },
      }}
      open={isVisible}
      onCancel={() => handleCloseModal(false)}
      closable={false}
      footer={null}
      width={'530px'}
      maskClosable={false}
    >
      <div className="flex flex-col rounded-2xl">
        <div className="flex items-center justify-center py-2">
          <Image className="object-cover" src={logoHT} alt="logoHT" />
        </div>
        <div className="w-full">
          <Form form={formRef} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-2xl bg-white p-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('TopupModalInfo')}
                </label>
              </div>

              <div className="col-span-12">
                <FormFloatSelect
                  filterOption={false}
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t('TopupModalPhone')}`,
                    },
                  ]}
                  showSearch
                  onSearch={getListmember}
                  name="userId"
                  required
                  onChange={handleShowName}
                  label={t('TopupModalPhone')}
                  options={listUser.map((item) => ({
                    id: item?.id,
                    value: item?.id,
                    label: item?.id,
                  }))}
                />
              </div>
              <div className="col-span-12">
                <FormFloatSelect
                  name="nameShow"
                  disabled
                  label={t('TopupModalInputName')}
                  options={listUser.map((item) => ({
                    id: item?.id,
                    value: item?.id,
                    label: item?.fullName,
                  }))}
                />
              </div>
              <div className="col-span-12">
                <FormFloatNumber
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseInput')} ${t('TopupModalInputAmount')}`,
                    },
                  ]}
                  name="totalAmount"
                  required
                  precision={0}
                  onChange={(value) => setTextNote(value)}
                  label={t('TopupModalInputAmount')}
                />
              </div>
              <div className="col-span-12 my-2">{t('NoteTimeUsePoint')}</div>
              <div className="col-span-12 grid grid-cols-2">
                <div className="col-span-1 mb-2">
                  <label>{t('noteBeforeVAT')}</label>
                </div>
                <div className="col-span-1 mb-2 flex justify-end">
                  <label>
                    {t('noteAmountToPointPayment', {
                      totalAmount:
                        formatNumber(
                          Math.round(
                            textNote -
                              Math.round(tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount)),
                          ),
                        ) ?? 0,
                    })}
                  </label>
                </div>
                <div className="col-span-1 mb-2">
                  <label>{`VAT (${currentFeeVAT?.vatAmount ?? 0}%)`}</label>
                </div>
                <div className="col-span-1 mb-2 flex justify-end">
                  <label>
                    {t('noteAmountToPointPayment', {
                      totalAmount:
                        formatNumber(
                          Math.round(tinhSoTienTruocThue(textNote, currentFeeVAT?.vatAmount)),
                        ) ?? 0,
                    })}
                  </label>
                </div>
                <div className="col-span-1 mb-2 font-bold">
                  <label>{t('TotalPointReceive')}</label>
                </div>
                <div className="col-span-1 mb-2 flex justify-end font-bold">
                  <label>
                    {t('noteTopupAmountToPoint', {
                      totalAmount: formatNumber(textNote) ?? 0,
                    })}
                  </label>
                </div>
              </div>
              <div className="col-span-12">
                <FormFloatInputArea
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseInput')} ${t('TopupContracNumber')}`,
                    },
                  ]}
                  row={1}
                  name="contactNumber"
                  required
                  label={t('TopupContracNumber')}
                />
              </div>
              <div className="col-span-12">
                <FormFloatSelect
                  required
                  name="paymentChannel"
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t('EcomTransactionPagePaymentMethod')}`,
                    },
                  ]}
                  label={t('EcomTransactionPagePaymentMethod')}
                  options={[
                    { label: 'Bank', value: 'Bank' },
                    { label: 'Other', value: 'Other' },
                  ].map((item) => ({
                    value: item?.value,
                    label: comm(item?.label),
                  }))}
                />
              </div>
              <div className="col-span-12">
                <FormFloatInputArea
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseInput')} ${t('TopupModalInputDescription')}`,
                    },
                  ]}
                  row={1}
                  name="description"
                  required
                  label={t('TopupModalInputDescription')}
                />
              </div>

              <div className="col-span-12 flex justify-end">
                <Button
                  className={`!bg-portal-gray-2 text-sm !text-portal-black`}
                  onClick={handleCloseModal}
                >
                  {comm('Cancel')}
                </Button>
                {checkPermissonAcion(userInfo?.accesses, [
                  roleAdminGod,
                  appPermissions.portal_point.insert,
                ]) && (
                  <Button
                    loading={isPending}
                    className={`ml-2 !bg-portal-primaryButtonAdmin text-sm !text-portal-black`}
                    onClick={handleTopup}
                  >
                    {comm('Payment')}
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default TopupPointModal;
