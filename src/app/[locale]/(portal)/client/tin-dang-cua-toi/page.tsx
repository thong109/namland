'use client';
import authApiService from '@/apiServices/externalApiServices/authApiService';
import AppPageMeta from '@/components/AppPageMeta';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import { ModalBuyPushPackageOpen } from '@/components/UserTopup/utils/ModalBuyPushPackageOpen';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import UserAccountTypeConstant from '@/libs/constants/userAccountType';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form, Radio } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import PropertiesDataTable from './propertiesDataTable';

const MyPropoperties: FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const [isBuyPushPackageOpen, setIsBuyPushPackageOpen] = ModalBuyPushPackageOpen();
  const { userInfo, setUserInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const messageError = useTranslations('Message_Required');
  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');
  const [isVisitor, setIsVisitor] = useState<boolean>(true);
  useEffect(() => {
    if (
      userInfo?.type === UserTypeConstant.Customer &&
      (userInfo?.accountType === UserAccountTypeConstant.Visitor || userInfo?.accountType === null)
    ) {
      setIsVisitor(true);
    } else {
      setIsVisitor(false);
    }
  }, []);

  const [formProfile] = Form.useForm();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  const updateProfile = debounce(async () => {
    await formProfile.validateFields();
    try {
      setIsLoadingButton(true);
      const values = formProfile.getFieldsValue();
      const body = {
        id: userInfo.id,
        aboutMe: userInfo.aboutMe,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
        ...values,
      };
      await authApiService.updateProfile(body).finally(() => {
        setIsLoadingButton(false), getCurrentUser();
      });
    } catch {
      setIsLoadingButton(false);
    }
  }, 200);

  const getCurrentUser = async () => {
    const userResponse = await authApiService.getCurrentUser();
    const user = userResponse.data ?? null;
    if (user?.accountType === UserAccountTypeConstant.Owner) {
      setIsVisitor(false);
      notify('success', success('updateAPI'));
    } else {
      notify('error', error('updateAPI'));
      setIsVisitor(true);
    }
    setUserInfo(user);
  };
  return userInfo?.type === UserTypeConstant.Customer ? (
    isVisitor ? (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Form form={formProfile} layout="vertical" initialValues={{ accountType: 'owner' }}>
          <div className="grid w-full grid-cols-12 gap-y-0 rounded bg-white px-4 py-1 lg:w-[400px]">
            <div className="col-span-12 py-2 text-lg font-bold text-primaryColor">
              {t('EcomPropertyListingRegisterRole')}
            </div>
            <div className="col-span-12">
              <Form.Item
                label={t('EcomPropertyListingIAm')}
                name="accountType"
                rules={[
                  {
                    required: true,
                    message: messageError('EcomPropertyListingIAm'),
                  },
                ]}
              >
                <Radio.Group className="flex w-full justify-between">
                  <Radio value="owner/broker"> {comm('owner/broker')} </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="col-span-12">
              <FormFloatInput
                label={t('EcomRegisterIndividualPageAddress')}
                name={['extraInfo', 'address']}
                rules={[
                  {
                    required: true,
                    message: messageError('addressRequired'),
                  },
                  {
                    max: 200,
                    message: `${messageError('maxlength', {
                      number: 200,
                    })} `,
                  },
                ]}
              />
            </div>
            <div className="col-span-12">
              <FormFloatInput
                label={t('EcomRegisterIndividualPageTaxCode')}
                name={['extraInfo', 'taxCode']}
                rules={[
                  {
                    required: true,
                    message: messageError('addressRequired'),
                  },
                ]}
              />
            </div>
            <div className="col-span-12">
              <FormFloatDate
                label={t('EcomRegisterIndividualPageDateOfIssuance')}
                name={['extraInfo', 'taxCodeDateOfIssue']}
                rules={[
                  {
                    required: true,
                    message: messageError('taxCodeDateOfIssueRequired'),
                  },
                ]}
              />
            </div>
            <div className="col-span-12">
              <FormFloatInput
                label={t('EcomRegisterIndividualPagePlaceOfIssuance')}
                name={['extraInfo', 'taxCodePlaceOfIssue']}
                rules={[
                  {
                    required: true,
                    message: messageError('taxCodePlaceOfIssueRequired'),
                  },
                  {
                    max: 200,
                    message: `${messageError('maxlength', {
                      number: 200,
                    })} `,
                  },
                ]}
              />
            </div>
            <div className="col-span-12 mb-1">
              <Button
                size="large"
                className="w-full rounded border !border-portal-primaryMainAdmin !bg-portal-primaryMainAdmin !text-white focus:text-white"
                loading={isLoadingButton}
                onClick={updateProfile}
              >
                {t('EcomPropertyListingUpdateRole')}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    ) : (
      <>
        <AppPageMeta title={t('EcomPropertyListingPageHeaderProperties')} />
        <div className="h-fit w-full bg-transparent px-5">
          <div className="align-items-center mb-4 mt-7 flex justify-between">
            <h1
              onClick={() => setIsBuyPushPackageOpen(true)}
              className="text-3xl font-semibold text-portal-primaryMainAdmin"
            >
              {t('EcomPropertyListingPageHeaderProperties')}
            </h1>
          </div>

          <PropertiesDataTable />
        </div>
      </>
    )
  ) : (
    <WaringPermission />
  );
};

export default MyPropoperties;
