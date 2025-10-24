'use client';
import apiConversationService from '@/apiServices/externalApiServices/apiConversationservice';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import ItemMessage from '@/components/InputComment/ItemMessage';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useProvince from '@/hooks/useProvince';
import { appPermissions, moduleConversation, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import { ConversationModel } from '@/models/conversationModel/ConversationModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Switch, Tabs } from 'antd';
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
const NewHomeInquiryDetailStaff: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');

  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const [formInquiry] = Form.useForm();
  const [formChat] = Form.useForm();
  const [ticketDetail, setTicketDetail] = useState<any>();
  const [listComment, setListComment] = useState<ConversationModel[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfo);

  const { listProvince } = useProvince();
  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      getDetail(params.id);
    }
  }, []);

  const getDetail = async (id: string) => {
    if (params.id) {
      try {
        const data = await apiTicketManagement.getInquryNewHomeByStaff(id);

        getInfoLocation(data?.newHomes?.location);
        formInquiry.setFieldsValue({ ...data?.newHomes });
        setTicketDetail(data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getListWard = async (districId: string) => {
    let dataWard = await apiMasterDataService.getWards(districId);
    setListWard(dataWard);
  };

  const getInfoLocation = (location) => {
    if (location?.province) {
      getListDistric(location?.province);
    }
    if (location?.district) {
      getListWard(location?.district);
    }
  };

  const getListDistric = async (provinceId: string) => {
    let dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);

    setListDistrict(dataDistrict);
  };

  const getListComment = async () => {
    const listComment: any = await apiConversationService.getConversationNEwHomeInquiry({
      referenceId: params.id,
      from: 0,
      Size: 500,
    });

    setListComment(listComment?.data);
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
    if (tabKey === tabKeys.tabCommnent) {
      getListComment();
    }
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
                ? t('EcomProjectManagementPageNewHomeInfo')
                : t('EcomProjectManagementPageNewHomeInfo')}
            </h1>
          </div>
          <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
            <TabPane tab={t(tabKeys.tabInfo)} key={tabKeys.tabInfo}>
              <Form form={formInquiry} layout="vertical">
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomProjectManagementPageNewHomeInfo')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatInput
                      label={t('EcomProjectManagementPageNewHomeTitle')}
                      name="title"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      label={t('EcomProjectManagementPageNewHomeFromArea')}
                      name="fromArea"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      label={t('EcomProjectManagementPageNewHomeToArea')}
                      name="toArea"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      label={t('EcomProjectManagementPageNewHomeFromRoom')}
                      name="fromRoom"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      label={t('EcomProjectManagementPageNewHomeToRoom')}
                      name="toRoom"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      label={t('EcomProjectManagementPageNewHomeFromPrice')}
                      name="fromPrice"
                    />
                  </div>

                  <div className="col-span-4">
                    <FormFloatNumber
                      label={t('EcomProjectManagementPageNewHomeToPrice')}
                      name="toPrice"
                    />
                  </div>

                  <div className="col-span-12">
                    <Form.Item
                      name="isActive"
                      label={t('EcomTicketManagementInforPageSearchBarStatus')}
                      valuePropName="checked"
                    >
                      <Switch className="mr-2 bg-[#b0b2b8]" />
                    </Form.Item>
                  </div>

                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailLocation')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatInput
                      required
                      label={t('EcomBannerManagementPageCreateProjectAddress')}
                      name={['location', 'address']}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatSelect
                      name={['location', 'province']}
                      label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                      required
                      showSearch={true}
                      options={listProvince.map((province) => ({
                        value: province.provinceID,
                        label: province.listProvinceName,
                      }))}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatSelect
                      name={['location', 'district']}
                      label={t('EcomPropertyListingDetailPageLocationDistrict')}
                      required
                      showSearch={true}
                      options={listDistrict?.map((x) => ({
                        value: x?.listDistrictID,
                        label: x?.nameDisplay,
                        id: x?.listDistrictID,
                      }))}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <FormFloatSelect
                      name={['location', 'ward']}
                      label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                      required
                      showSearch={true}
                      options={listWard.map((x) => ({
                        value: x?.listWardID,
                        label: x?.nameDisplay,
                        id: x?.listWardID,
                      }))}
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

export default NewHomeInquiryDetailStaff;
