'use client';
import apiConversationService from '@/apiServices/externalApiServices/apiConversationservice';
import staffApiService from '@/apiServices/externalApiServices/apiStaffService';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import InputComment from '@/components/InputComment/InputComment';
import ItemMessage from '@/components/InputComment/ItemMessage';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  appPermissions,
  listStatusOSA,
  listStatusOwnInquiry,
  moduleConversation,
  roleAdminGod,
  statusOwnInquiryEnum,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import { ConversationModel } from '@/models/conversationModel/ConversationModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Select, Tabs } from 'antd';
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
const Option = Select.Option;
export interface Props {
  params: any;
}
const OwnerInquiryStaff: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const error = useTranslations('error');
  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const [formInquiry] = Form.useForm();
  const [formChat] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketDetail, setTicketDetail] = useState<any>();
  const [listComment, setListComment] = useState<ConversationModel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfo);
  const [listStaff, setListStaff] = useState([] as any);
  const [blockZoneOSA, setBlockzoneOSA] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (params.id) {
      getDetail(params.id);
    }
    getListStaff('');
  }, []);

  const getListStaff = async (keyowrd: string) => {
    const filter = {
      from: 0,
      size: 20,
      keyowrd: keyowrd,
    };
    const res = await staffApiService.getListStaff(filter);
    const staffs = res?.data;

    setListStaff(staffs ?? []);
  };

  const getDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await apiTicketManagement.getOwnInquiryStaffByid(id);
      setTicketDetail(data);
      formInquiry.setFieldsValue(data);
      if (data?.osaInfo.osaId) {
        setBlockzoneOSA(true);
      } else {
        setBlockzoneOSA(false);
      }

      getListComment();
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const onSaveTicket = async () => {
    await formInquiry.validateFields();
    const values = formInquiry.getFieldsValue();
    if (
      values.osaInfo &&
      values.osaInfo.ownerServiceAgreementId === undefined &&
      values.osaInfo.commission === undefined &&
      values.osaInfo.startDate === undefined &&
      values.osaInfo.endDate === undefined
    ) {
      values.osaInfo = null;
    }

    if (blockZoneOSA) {
      delete values.osaInfo;
    }
    let body;
    if (values.status === statusOwnInquiryEnum.SiteVisit) {
      //nếu status bằng 2 (trạng thái đề nghị) = sitevisit mới truyển về
      body = {
        id: ticketDetail?.id,
        ...values,
      };
    } else {
      delete values.visitDate;
      body = {
        id: ticketDetail?.id,
        ...values,
      };
    }

    try {
      await apiTicketManagement.updateOwnInquiryStaff(body);
      notify('success', success('updateAPI'));
      push('/admin/own-inquiry-admin');
    } catch {
      notify('error', errorNoti('updateAPI'));
    }
  };

  const onChangeStatus = (status) => {
    if (status !== statusOwnInquiryEnum.SiteVisit) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
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

    if (infoUser) {
      const body = {
        conversationUniqueId: ticketDetail?.id,
        content: values.message,
        recipient: infoUser?.ownerInfo?.phone,
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
        <ButtonBack text={t('goBack')} onClick={() => push('/admin/own-inquiry-admin')} />

        {userInfo?.type === UserTypeConstant.Salesman &&
          checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_owner_inquiry.update,
            appPermissions.portal_owner_inquiry.admin,
          ]) && (
            <ButtonPrimary
              text={t('save')}
              onClick={() => onSaveTicket()}
              className="ml-1 rounded-full px-6"
              isLoading={isLoading}
            />
          )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_owner_inquiry.view,
      appPermissions.portal_owner_inquiry.update,
      appPermissions.portal_owner_inquiry.admin,
    ]) ? (
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
                      name="title"
                      label={t('EcomTicketManagementDetailPageDetailTicketTitle')}
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatSelect
                      onChange={onChangeStatus}
                      label={t('EcomTicketManagementDetailPageDetailTicketStatus')}
                      name="status"
                      options={listStatusOwnInquiry.map((x) => ({
                        value: x.value,
                        label: comm(x.name),
                        id: x.id,
                      }))}
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseInput')} ${t(
                            'EcomTicketManagementDetailPageDetailTicketStatus',
                          )}`,
                        },
                      ]}
                    />
                  </div>

                  <div className="lg:col-span-8"></div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailOwnerInfo')}
                    </label>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      disabled
                      name={['ownerInfo', 'clientName']}
                      label={t('EcomTicketManagementDetailPageDetailClientName')}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['ownerInfo', 'phone']}
                      label={t('EcomTicketManagementDetailPageDetailPhone')}
                      disabled
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatInput
                      name={['ownerInfo', 'email']}
                      label={t('EcomTicketManagementDetailPageDetailEmail')}
                      disabled
                    />
                  </div>
                  <div className="col-span-12">
                    <FormFloatInputArea
                      row={3}
                      name={['ownerInfo', 'message']}
                      label={t('EcomTicketManagementDetailPageDetailMessage')}
                      disabled
                    />
                  </div>
                </div>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailPersonInCharge')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t(
                            'EcomTicketManagementDetailPageDetailPersonInCharge',
                          )}`,
                        },
                      ]}
                      name="personInChargeId"
                      label={t('EcomTicketManagementDetailPageDetailPersonInCharge')}
                    >
                      <Select allowClear className="w-full" showSearch onSearch={getListStaff}>
                        {listStaff.map((option, index) => (
                          <Option key={index} value={option.id}>
                            {`${option.fullName ?? option.lastName + option.firstName} - ${option.phone}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailVisitInfo')}
                    </label>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatDate
                      disabled={isDisabled}
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      name="visitDate"
                      label={t('EcomTicketManagementDetailPageDetailVitsitDate')}
                    />
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 flex items-center py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailAgreementInfo')}
                    </label>

                    {listStatusOSA.map(
                      (item) =>
                        item.value === ticketDetail?.status && (
                          <label
                            className={`ml-3 rounded-full px-3 py-[6px] text-xs font-medium ${item.classCode}`}
                          >
                            {comm(item?.name)}
                          </label>
                        ),
                    )}
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatInput
                      rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                      name={['osaInfo', 'ownerServiceAgreementId']}
                      label={t('EcomTicketManagementDetailPageDetailAgreementId')}
                      disabled={blockZoneOSA}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatNumber
                      maxNum={999999999999}
                      name={['osaInfo', 'commission']}
                      label={t('EcomTicketManagementDetailPageDetailComissionAmount')}
                      disabled={blockZoneOSA}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatDate
                      name={['osaInfo', 'startDate']}
                      label={t('EcomTicketManagementDetailPageDetailStartDateAgreenment')}
                      disabled={blockZoneOSA}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <FormFloatDate
                      name={['osaInfo', 'endDate']}
                      label={t('EcomTicketManagementDetailPageDetailEndDateAgreenment')}
                      disabled={blockZoneOSA}
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

                {userInfo?.type === UserTypeConstant.Salesman && (
                  <div className="flex h-fit items-center justify-center bg-portal-gray-1">
                    <div className="w-full py-4">
                      <InputComment
                        labelButton={comm('sendComment')}
                        labelPlaceholder={comm('placeholder')}
                        form={formChat}
                        onSubmit={(file) => onSubmitMessage(file)}
                      />
                    </div>
                  </div>
                )}
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

export default OwnerInquiryStaff;
