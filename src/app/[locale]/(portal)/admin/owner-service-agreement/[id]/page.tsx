'use client';
import apiOSAService from '@/apiServices/externalApiServices/apiOSAmanagement';
import staffApiService from '@/apiServices/externalApiServices/apiStaffService';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  appPermissions,
  emailRegex,
  listStatusOSA,
  phoneRegex,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Select } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const Option = Select.Option;
export interface Props {
  params: any;
}
const OwnerServiceAgreementDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const idAddNew = params.id === 'add-new' ? true : false;
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const error = useTranslations('error');
  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const [formOSA] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listStaff, setListStaff] = useState([] as any);
  const [projects, setProjects] = useState<any[]>([]);
  const [listUnit, setListUnit] = useState<any[]>([]);
  const [lListOwnerInquiry, setListOwnerInquiry] = useState([] as any);
  const [OSADetail, setOSADetail] = useState<any>({});

  useEffect(() => {
    getListProject();
    getListOwnerInquiryNoPaging();
    getListStaff('');

    getDetail(params.id);
  }, []);

  const getListProject = async () => {
    const res = await projectApiService.getLookupProjects();

    setProjects(res.data);
  };

  const getListOwnerInquiryNoPaging = async () => {
    const res = await apiTicketManagement.getListOwnerInquiryNoPaging();
    const data = res ?? [];
    setListOwnerInquiry(data);
  };

  const getListUnit = async (projectId?: number, keyword?: string) => {
    if (projectId) {
      const filter = {
        from: 0,
        size: 20,
        projectId: projectId,
        keyword: keyword,
      };
      const res: any = await unitApiInAdmin.getUnitList(filter);
      formOSA.setFieldValue(['propertyInfo', 'unitId'], undefined);
      setListUnit(res.data);
    } else {
      formOSA.setFieldValue(['propertyInfo', 'unitId'], undefined);
      setListUnit([]);
    }
  };

  const getDetail = async (id: string) => {
    if (!idAddNew) {
      setIsLoading(true);
      try {
        const data = await apiOSAService.getByid(id);

        formOSA.setFieldsValue(data);

        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    } else {
      formOSA.resetFields();
    }
  };

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

  const saveOSA = async () => {
    await formOSA.validateFields();
    const values = formOSA.getFieldsValue();

    try {
      if (idAddNew) {
        await apiOSAService.create(values);

        notify('success', success('updateAPI'));
        push('/admin/owner-service-agreement');
      } else {
        await apiOSAService.update({ ...values, id: params.id });

        notify('success', success('createAPI'));
        push('/admin/owner-service-agreement');
      }
    } catch {
      notify('error', errorNoti('updateAPI'));
    }
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push('/admin/owner-service-agreement')} />

        {userInfo?.type === UserTypeConstant.Salesman && (
          <ButtonPrimary
            text={t('save')}
            onClick={() => saveOSA()}
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
      appPermissions.portal_osa.view,
      appPermissions.portal_osa.admin,
    ]) ? (
    <>
      <AppPageMeta title={`${t('EcomTicketManagementInforPageDetailOSADetail')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {params.id
                ? t('EcomTicketManagementInforPageDetailOSADetail')
                : t('EcomTicketManagementInforPageDetailOSADetailNew')}
            </h1>
          </div>

          <Form form={formOSA} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomTicketManagementDetailPageDetailOwnerInquiryInfo')}
                </label>
                {listStatusOSA.map(
                  (item) =>
                    item.value === OSADetail?.status && (
                      <label
                        className={`ml-3 rounded-full px-3 py-[6px] text-xs font-medium ${item.classCode}`}
                      >
                        {comm(item?.name)}
                      </label>
                    ),
                )}
              </div>
              <div className="col-span-12">
                <FormFloatSelect
                  showSearch
                  label={t('EcomTicketManagementDetailPageDetailOwnerInquiryTitle')}
                  name="ownerInquiryId"
                  filterOption={true}
                  options={lListOwnerInquiry?.map((x) => ({
                    value: x.id,
                    label: ` ${x.id} - ${x.title}`,
                    id: x.id,
                  }))}
                />
              </div>
            </div>

            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomTicketManagementDetailPageDetailOwnerInfo')}
                </label>
              </div>
              <div className="col-span-4">
                <FormFloatInput
                  rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                  name={['ownerInfo', 'clientName']}
                  label={t('EcomTicketManagementDetailPageDetailOwnerName')}
                />
              </div>
              <div className="col-span-4">
                <FormFloatInput
                  rules={[
                    { max: 15, message: `${error('maxlength')} 15` },
                    {
                      pattern: phoneRegex,
                      message: `${error('formatPhoneError')}`,
                    },
                  ]}
                  name={['ownerInfo', 'phone']}
                  label={t('EcomTicketManagementDetailPageDetailOwnerPhone')}
                />
              </div>
              <div className="col-span-4">
                <FormFloatInput
                  rules={[
                    { min: 6, message: `${error('minLength')} 6` },
                    { max: 256, message: `${error('maxlength')} 256` },
                    {
                      pattern: emailRegex,
                      message: `${error('formatEmailError')}`,
                    },
                  ]}
                  name={['ownerInfo', 'email']}
                  label={t('EcomTicketManagementDetailPageDetailOwnerEmai')}
                />
              </div>
              <div className="col-span-12">
                <FormFloatInputArea
                  rules={[{ max: 5000, message: `${error('maxlength')} 5000` }]}
                  row={3}
                  name={['ownerInfo', 'message']}
                  label={t('EcomTicketManagementDetailPageDetailOwnernMessage')}
                />
              </div>
            </div>
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomTicketManagementDetailPageDetailProjectInfo')}
                </label>
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  onChange={(projectId) => getListUnit(projectId)}
                  required
                  label={t('EcomBannerManagementPageProject')}
                  name={['propertyInfo', 'projectId']}
                  filterOption={true}
                  options={projects?.map((x) => ({
                    value: x.id,
                    label: x.name,
                    id: x.id,
                  }))}
                />
              </div>

              <div className="col-span-6">
                <FormFloatSelect
                  label={t('EcomBannerManagementPageUnit')}
                  name={['propertyInfo', 'unitId']}
                  filterOption={true}
                  options={listUnit?.map((x) => ({
                    value: x.id,
                    label: x.unitNo,
                    id: x.id,
                  }))}
                />
              </div>
            </div>
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomTicketManagementDetailPageDetailAgreementInfoDetail')}
                </label>
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                  name="ownerServiceAgreementId"
                  label={t('EcomTicketManagementDetailPageDetaiOwnerServiceAgreementId')}
                />
              </div>
              <div className="col-span-12">
                <FormFloatInput
                  rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                  name={['agreementInfo', 'name']}
                  label={t('EcomTicketManagementDetailPageDetailAgreementName')}
                />
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t('EcomTicketManagementDetailPageDetailAgreementStatus')}`,
                    },
                  ]}
                  label={t('EcomTicketManagementDetailPageDetailAgreementStatus')}
                  name={['agreementInfo', 'status']}
                  filterOption={true}
                  options={listStatusOSA?.map((x) => ({
                    value: x.id,
                    label: comm(x.name),
                    id: x.id,
                  }))}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <FormFloatNumber
                  maxNum={9999999999}
                  name={['agreementInfo', 'commission']}
                  label={t('EcomTicketManagementDetailPageDetailCommission')}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <FormFloatDate
                  name={['agreementInfo', 'startDate']}
                  label={t('EcomTicketManagementDetailPageDetailStartDate')}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <FormFloatDate
                  name={['agreementInfo', 'endDate']}
                  label={t('EcomTicketManagementDetailPageDetailEndDate')}
                />
              </div>
              <div className="col-span-12">
                <FormFloatInputArea
                  rules={[{ max: 5000, message: `${error('maxlength')} 5000` }]}
                  name={['agreementInfo', 'message']}
                  label={t('EcomTicketManagementDetailPageDetailMessage')}
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
          </Form>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default OwnerServiceAgreementDetail;
