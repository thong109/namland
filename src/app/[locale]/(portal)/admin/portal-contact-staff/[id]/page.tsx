'use client';
import contactApiService from '@/apiServices/externalApiServices/apiContact';
import AppPageMeta from '@/components/AppPageMeta';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
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

const ViewDetailMemViewDetailContactForStaff: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { back } = useRouter();
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const [contactInfoForm] = Form.useForm();
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState(undefined);
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const contactReponse: any = await contactApiService.getByid(params.id);
    setContactInfo(contactReponse ?? undefined);

    contactInfoForm.setFieldsValue({
      ...contactReponse,
      createdAt: contactReponse?.createdAt ? dayjs(contactReponse?.createdAt) : null,
    });
  };

  const handelOk = async () => {
    const contactInfoValue = await contactInfoForm.validateFields();
    let body;
    if (contactInfo.clientView) {
      body = {
        id: params.id,
        clientName: contactInfoValue.clientView.clientName,
        phone: contactInfoValue.clientView.phone,
        email: contactInfoValue.clientView.email,
        message: contactInfoValue.message,
      };
    } else {
      body = {
        id: params.id,
        clientName: contactInfoValue.ownerBrokerView.clientName,
        phone: contactInfoValue.ownerBrokerView.phone,
        email: contactInfoValue.ownerBrokerView.email,
        message: contactInfoValue.message,
      };
    }

    const contactReponse = await contactApiService.updateContact(body);
    if (contactReponse.success) {
      notify('success', success('updateAPI'));
      back();
    }
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

          {/* <Button
            size="large"
            onClick={handelOk}
            className=" !rounded z-0 border border-portal-primaryMainAdmin bg-portal-primaryMainAdmin text-white py-2 px-5 uppercase text-lg lg:w-fit w-full lg:mb-0 mb-1"
          >
            <label>{t('save')}</label>
          </Button> */}
        </div>
      </>
    );
  };
  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_contact.view,
    appPermissions.portal_contact.admin,
  ]) ? (
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
                  <strong>{t('clientInfo')}</strong>
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput
                    rules={[{ required: true, message: t('inputClientName') }]}
                    name={['clientView', 'clientName']}
                    label={t('clientName')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput
                    rules={[{ required: true, message: t('inputPhone') }]}
                    name={['clientView', 'phone']}
                    label={t('phone')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <FormFloatInput name={['clientView', 'email']} label={t('email')} />
                </div>
              </div>
            )}
            <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
              <div className="col-span-12 mt-3 pb-6">
                <strong>{t('EcomTContacManagementDetailPageDetailContactInfo')}</strong>
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
            {contactInfo && contactInfo?.dataRole === UserTypeConstant.Salesman && (
              <>
                {contactInfo?.clientView && (
                  <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white px-3">
                    <div className="col-span-12 mt-3 pb-5">
                      <strong>{t('EcomContactListDetailPageDetailClientInfo')}</strong>
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <FormFloatInput
                        name={['clientView', 'clientName']}
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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

export default ViewDetailMemViewDetailContactForStaff;
