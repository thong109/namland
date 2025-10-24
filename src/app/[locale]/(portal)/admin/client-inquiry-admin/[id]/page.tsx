'use client';
import apiConversationService from '@/apiServices/externalApiServices/apiConversationservice';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import ItemMessage from '@/components/InputComment/ItemMessage';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  appPermissions,
  listStatusTicketFilter,
  moduleConversation,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import { ConversationModel } from '@/models/conversationModel/ConversationModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabInfo: 'TAB_INFO_INQUIRY',
  tabCommnent: 'TAB_COMMENT_INQUIRY',
};
const { TabPane } = Tabs;

export interface Props {
  params: any;
}
const DetailTicketForStaff: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');

  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const [formInquiry] = Form.useForm();
  const [formChat] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketDetail, setTicketDetail] = useState<any>();
  const [listComment, setListComment] = useState<ConversationModel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfo);

  useEffect(() => {
    if (params.id) {
      getDetail(params.id);
    }
  }, []);

  const getDetail = async (id: string) => {
    if (params.id) {
      setIsLoading(true);
      try {
        const data = await apiTicketManagement.getByid(id);

        formInquiry.setFieldsValue(data);
        setTicketDetail(data);
        getListComment();
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    }
  };

  const onSaveTicket = async () => {
    await formInquiry.validateFields();
    const values = formInquiry.getFieldsValue();
    const body = {
      id: ticketDetail?.id,
      ticketStatus: values.ticketStatus,
    };
    try {
      await apiTicketManagement.updateStatus(body);
      notify('success', success('updateAPI'));
      push('/admin/client-inquiry-admin');
    } catch {
      notify('error', errorNoti('updateAPI'));
    }
  };

  const getListComment = async () => {
    const listComment = await apiConversationService.getListConvesationWithId(
      params.id,
      moduleConversation.ticket,
    );
    setListComment(listComment);
  };

  const onSubmitMessage = async (file?: File) => {
    formChat.validateFields();
    const values = formChat.getFieldsValue();
    const infoUser = formInquiry.getFieldsValue();

    if (values || file) {
      const body = {
        conversationUniqueId: ticketDetail?.id,
        content: values.message,
        recipient:
          infoUser?.ownerBrokerView?.phone === userInfo?.phone
            ? infoUser.clientView?.phone
            : infoUser.ownerBrokerView?.phone,
        moduleId: moduleConversation.ticket,
      };

      try {
        await apiConversationService.createConversation(body, file);

        setTimeout(() => {
          getListComment();
        }, 1000);
        formChat.resetFields();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push('/admin/client-inquiry-admin')} />
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.portal_ticket.view]) ? (
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
          <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
            <TabPane tab={t(tabKeys.tabInfo)} key={tabKeys.tabInfo}>
              <Form form={formInquiry} layout="vertical">
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailTicketInfo')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatInputArea
                      disabled
                      name={['listing', 'title']}
                      label={t('EcomTicketManagementDetailPageDetailTicketTitle')}
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatSelect
                      disabled
                      label={t('EcomTicketManagementDetailPageDetailTicketStatus')}
                      name="ticketStatus"
                      options={listStatusTicketFilter.map((x) => ({
                        value: x.value,
                        label: t(x.name),
                        id: x.id,
                      }))}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatNumber
                      disabled
                      label={t('EcomTicketManagementDetailPageDetailInquiryRent')}
                      name="rent"
                    />
                  </div>
                  <div className="lg:col-span-4"></div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailClientInfo')}
                    </label>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      disabled
                      name={['clientView', 'clientName']}
                      label={t('EcomTicketManagementDetailPageDetailClientName')}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['clientView', 'phone']}
                      label={t('EcomTicketManagementDetailPageDetailPhone')}
                      disabled
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['clientView', 'email']}
                      label={t('EcomTicketManagementDetailPageDetailEmail')}
                      disabled
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatNumber
                      disabled
                      label={t('EcomTicketManagementDetailPageDetailInquiryRent')}
                      name="rent"
                    />
                  </div>
                  <div className="col-span-12">
                    <FormFloatInputArea
                      row={3}
                      name="message"
                      label={t('EcomTicketManagementDetailPageDetailMessage')}
                      disabled
                    />
                  </div>
                  <div className="lg:col-span-4"></div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailPosterInfo')}
                    </label>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      disabled
                      name={['ownerBrokerView', 'clientName']}
                      label={t('EcomTicketManagementDetailPageDetailClientName')}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['ownerBrokerView', 'phone']}
                      label={t('EcomTicketManagementDetailPageDetailPhone')}
                      disabled
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['ownerBrokerView', 'email']}
                      label={t('EcomTicketManagementDetailPageDetailEmail')}
                      disabled
                    />
                  </div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailPropertyInfo')}
                    </label>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatInput
                      disabled
                      name={['project', 'projectName']}
                      label={t('EcomTicketManagementDetailPageDetailProject')}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatInput
                      name={['unit', 'unitNo']}
                      label={t('EcomTicketManagementDetailPageDetailUnitNumber')}
                      disabled
                    />
                  </div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailVisitInfo')}
                    </label>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatDate
                      name="visitDate"
                      label={t('EcomTicketManagementDetailPageDetailVitsitDate')}
                      disabled
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatDate
                      name="visitDate"
                      label={t('EcomTicketManagementDetailPageDetailVitsitTime')}
                      disabled
                      format="HH:mm"
                    />
                  </div>
                </div>
              </Form>
            </TabPane>
            <TabPane tab={t(tabKeys.tabCommnent)} key={tabKeys.tabCommnent}>
              <div className="col-span-12 h-fit lg:col-span-6 lg:h-full">
                <div className="mt-3 flex items-center justify-start rounded-t-lg bg-white">
                  <label className="py-5 pl-3 text-lg font-bold">
                    {t('EcomTicketManagementDetailPageDetailComment')}
                  </label>
                </div>
                <div className="h-fit max-h-[50vh] overflow-y-auto bg-portal-gray-1 lg:h-[50vh]">
                  <div className="mt-2 w-full flex-col">
                    {listComment.map((item) => (
                      <ItemMessage key={item.id} data={item} userId={userInfo?.id} />
                    ))}
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default DetailTicketForStaff;
