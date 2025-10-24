'use client';
import contactApiService from '@/apiServices/externalApiServices/apiContact';
import AppPageMeta from '@/components/AppPageMeta';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface Props {
  params: any;
}

const ViewDetailContact: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const { back } = useRouter();
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  const [contactInfoForm] = Form.useForm();
  const [contactInfo, setContactInfo] = useState<any>(undefined);
  useEffect(() => {
    getDetail();
  }, [params.id]);

  const getDetail = async () => {
    const contact: any = await contactApiService.getByid(params.id);
    setContactInfo(contact ?? undefined);

    contactInfoForm.setFieldsValue({
      ...contact,
      createdAt: contact?.createdAt ? dayjs(contact?.createdAt) : null,
    });
  };

  const renderActions = () => {
    return (
      <>
        <div className="flex w-full flex-col justify-end lg:flex-row">
          <Button
            onClick={() => back()}
            size="large"
            className="z-0 mb-1 w-full !rounded border border-portal-blackGray bg-white px-5 py-2 text-lg uppercase text-portal-blackGray lg:mb-0 lg:mr-2 lg:w-fit"
          >
            {t('goBack')}
          </Button>
        </div>
      </>
    );
  };
  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={`${t('EcomContactListDetailPageHeaderContactList')}`} />
      <WrapPageScroll renderActions={renderActions} notShowDesktop>
        <div className="px-2 pt-10 lg:px-7">
          <div className="grid grid-cols-12 px-3">
            <div className="col-span-6 flex items-center">
              <h1 className="text-xl">{t('EcomContactListDetailPageHeaderContactList')}</h1>
            </div>
            <div className="col-span-6 hidden lg:block">{renderActions()}</div>
          </div>
          <Form form={contactInfoForm} layout="vertical">
            {contactInfo && contactInfo?.dataRole === UserTypeConstant.Salesman && (
              <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
                <div className="col-span-12 mt-3 pb-5">
                  <strong>{t('EcomCreateAPropertyPageDetailContactInformation')}</strong>
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput
                    disabled
                    name={['clientView', 'clientName']}
                    rules={[
                      {
                        required: true,
                        message: t('EcomTicketManagementDetailPageDetailClientName'),
                      },
                    ]}
                    label={t('EcomTicketManagementDetailPageDetailClientName')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput
                    disabled
                    name={['clientView', 'phone']}
                    rules={[
                      {
                        required: true,
                        message: t('EcomTicketManagementDetailPageDetailPhone'),
                      },
                    ]}
                    label={t('EcomTicketManagementDetailPageDetailPhone')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput
                    disabled
                    name={['clientView', 'email']}
                    rules={[
                      {
                        required: true,
                        message: t('EcomTicketManagementDetailPageDetailPhone'),
                      },
                    ]}
                    label={t('EcomTicketManagementDetailPageDetailEmail')}
                  />
                </div>
              </div>
            )}
            <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
              <div className="col-span-12 mt-3 pb-6">
                <strong>{t('EcomContactListDetailPageDetailClientInfo')}</strong>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <FormFloatDate
                  disabled
                  name="createdAt"
                  label={t('EcomContactListInfoPageListViewCreatedDate')}
                />
              </div>
              <div className="col-span-12">
                <FormFloatInput
                  name="message"
                  disabled
                  label={t('EcomContactListDetailPageDetailMessage')}
                />
              </div>
            </div>
            {contactInfo && contactInfo?.dataRole === UserTypeConstant.Customer && (
              <>
                {contactInfo?.clientView && (
                  <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
                    <div className="col-span-12 mt-3 pb-5">
                      <strong>{t('EcomContactListDetailPageDetailClientInfo')}</strong>
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['clientView', 'clientName']}
                        rules={[
                          {
                            required: true,
                            message: t('EcomContactListDetailPageDetailClientName'),
                          },
                        ]}
                        label={t('EcomContactListDetailPageDetailClientName')}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['clientView', 'phone']}
                        rules={[
                          {
                            required: true,
                            message: t('EcomContactListDetailPageDetailPhone'),
                          },
                        ]}
                        label={t('EcomContactListDetailPageDetailPhone')}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['clientView', 'email']}
                        label={t('EcomContactListDetailPageDetailEmail')}
                      />
                    </div>
                  </div>
                )}
                {contactInfo?.ownerBrokerView && (
                  <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
                    <div className="col-span-12 mt-3 pb-5">
                      <strong>{t('EcomContactListDetailPageDetailOwnerBrokerInfo')}</strong>
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['ownerBrokerView', 'clientName']}
                        rules={[
                          {
                            required: true,
                            message: t('EcomContactListInfoPageSearchBarClientName'),
                          },
                        ]}
                        label={t('EcomContactListInfoPageSearchBarClientName')}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['ownerBrokerView', 'phone']}
                        rules={[
                          {
                            required: true,
                            message: t('EcomContactListDetailPageDetailPhone'),
                          },
                        ]}
                        label={t('EcomContactListDetailPageDetailPhone')}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['ownerBrokerView', 'email']}
                        label={t('EcomContactListDetailPageDetailEmail')}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </Form>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ViewDetailContact;
