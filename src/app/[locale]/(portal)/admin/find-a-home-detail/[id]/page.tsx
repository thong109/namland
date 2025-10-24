'use client';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import FormFloatInput from '@/components/FormInput/formInput';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

export interface Props {
  params: any;
}
const DetailTicketPage: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const { userInfo } = useGlobalStore();
  const { push } = useRouter();

  const [formInquiry] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketDetail, setTicketDetail] = useState<any>();

  useEffect(() => {
    if (params.id) {
      getDetail(params.id);
    }
  }, []);

  const getDetail = async (id: string) => {
    if (params.id) {
      setIsLoading(true);
      try {
        const data = await apiTicketManagement.getFindAHomeByid(id);

        formInquiry.setFieldsValue(data);
        setTicketDetail(data);

        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    }
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push('/client/client-inquiry')} />
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman ? (
    <>
      <AppPageMeta title={`${t('EcomTicketManagementInforPageBoardViewTicketId')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {params.id
                ? t('EcomTicketManagementInforPageBoardViewTicketId')
                : t('EcomTicketManagementInforPageBoardViewTicketNew')}
            </h1>
          </div>

          <Form form={formInquiry} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomTicketManagementDetailPageDetailTicketInfo')}
                </label>
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="name"
                  label={t('FindHoneRequestName')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[{ max: 250 }]}
                  name="numberOfOccupants"
                  label={t('FindHoneRequestMemberOfOcc')}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="preferredLocation"
                  label={t('FindHoneRequestPreferredLocation')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[{ max: 250 }]}
                  name="layoutPreference"
                  label={t('FindHoneRequestLayoutPreferrence')}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[{ max: 250 }]}
                  name="leaseTerm"
                  label={t('FindHoneRequesLeaseTerm')}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="contactInfomation"
                  label={t('FindHoneRequestContactInfoMation')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="typeOfProperty"
                  label={t('FindHoneRequestTypeOfProperty')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="budget"
                  label={t('FindHoneRequestBudgetRendRange')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  name="moveInDate"
                  label={t('FindHoneRequestMoveInDate')}
                  rules={[{ required: true, max: 250 }]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[{ max: 250 }]}
                  name="aboutYou"
                  label={t('FindHoneRequestAboutYou')}
                />
              </div>
            </div>
          </Form>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default DetailTicketPage;
