'use client';
import leaseAgreementApiService from '@/apiServices/externalApiServices/apiLeaseAgreementService';
import staffApiService from '@/apiServices/externalApiServices/apiStaffService';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  LADepositStatus,
  LAPayment,
  LAStatus,
  appPermissions,
  emailRegex,
  phoneRegex,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Select, Tabs } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabInfo: 'TAB_InFO_LEASEAGREEMENT',
};
const { TabPane } = Tabs;
const Option = Select.Option;
export interface Props {
  params: any;
}
const LeaseAgreementDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const error = useTranslations('error');

  const idAddNew = params.id === 'add-new' ? true : false;

  const { push } = useRouter();
  const { userInfo } = useGlobalStore();

  const [formLeaseAgreement] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leaseAgreement, setLeaseAgreement] = useState<any>();
  const [projects, setProjects] = useState<any[]>([]);
  const [listUnit, setListUnit] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfo);
  const [listStaff, setListStaff] = useState([] as any);

  useEffect(() => {
    if (!idAddNew) {
      getDetail(params.id);
    } else {
      formLeaseAgreement.resetFields();
    }
    initDataSelect();
  }, []);

  const initDataSelect = () => {
    getListStaff('');
    getListProject();
  };

  const getDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const data: any = await leaseAgreementApiService.getById(id);
      getListUnit(data?.inquiryDetail?.projectId, '', true);
      formLeaseAgreement.setFieldsValue({ ...data });
      setLeaseAgreement(data);

      setIsLoading(false);
    } catch {
      setIsLoading(false);
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
  const getListProject = async () => {
    const res = await projectApiService.getLookupProjects();

    setProjects(res.data);
  };

  const getListUnit = async (projectId?: number, keyword?: string, init?: boolean) => {
    if (init) {
      if (projectId) {
        const filter = {
          from: 0,
          size: 100,
          projectId: projectId,
          keyword: keyword,
        };
        const res: any = await unitApiInAdmin.getListUnit(filter);
        setListUnit(res);
      }
    } else {
      if (projectId) {
        const filter = {
          from: 0,
          size: 100,
          projectId: projectId,
          keyword: keyword,
        };
        const res: any = await unitApiInAdmin.getListUnit(filter);

        formLeaseAgreement.setFieldValue(['inquiryDetail', 'unitId'], undefined);
        setListUnit(res);
      } else {
        formLeaseAgreement.setFieldValue(['inquiryDetail', 'unitId'], undefined);
        setListUnit([]);
      }
    }
  };

  const onSave = async () => {
    await formLeaseAgreement.validateFields;
    const values = formLeaseAgreement.getFieldsValue();
    if (idAddNew) {
      await leaseAgreementApiService.createLA({
        ...values,
      });
      notify('success', success('createAPI'));
      push('/admin/lease-agreement');
    } else {
      await leaseAgreementApiService.updateLA({
        ...leaseAgreement,
        ...values,
      });
      push('/admin/lease-agreement');
      notify('success', success('updateAPI'));
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const setValueForLeaseTerm = async () => {
    const startDate = formLeaseAgreement.getFieldValue(['leaseExecution', 'laCommencementDate']);
    const endDate = formLeaseAgreement.getFieldValue(['leaseExecution', 'laExpirationDate']);

    if (startDate && endDate) {
      const res = await dateDifference(
        dayjs(startDate).endOf('days'),
        dayjs(endDate).endOf('days').add(1, 'days'),
      );

      const leaseTerm = `${res?.years} year(s), ${res?.months} month(s), ${res?.days} day(s)`;

      await formLeaseAgreement.setFieldValue(['leaseExecution', 'leaseTerm'], leaseTerm);
    }
  };

  const dateDifference = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const years = end.diff(start, 'years');
    const months = end.diff(start.add(years, 'years'), 'months');
    const days = end.diff(start.add(years, 'years').add(months, 'months'), 'days');

    return {
      years: years,
      months: months,
      days: days,
    };
  };
  const disabledDateLACommencementDate = (current) => {
    const endDate = formLeaseAgreement.getFieldValue(['leaseExecution', 'laCommencementDate']);

    if (endDate) {
      return current < endDate ? true : false;
    }
  };

  const disabledDateLAremindBeforeDay = (current) => {
    const startDate = formLeaseAgreement.getFieldValue(['leaseExecution', 'laExpirationDate']);

    if (startDate) {
      return current > startDate ? true : false;
    }
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push('/admin/lease-agreement')} />
        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_la.update,
          appPermissions.portal_la.insert,
          appPermissions.portal_la.admin,
        ]) && (
          <ButtonPrimary
            text={t('save')}
            onClick={onSave}
            className="ml-1 rounded-full px-6"
            isLoading={isLoading}
          />
        )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman ? (
    <>
      <AppPageMeta title={`${t('EcomPageLeaseAgreementLADetail')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {params.id ? t('EcomPageLeaseAgreementLADetail') : t('EcomPageLeaseAgreementLANew')}
            </h1>
          </div>
          <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
            <TabPane tab={t(tabKeys.tabInfo)} key={tabKeys.tabInfo}>
              <Form form={formLeaseAgreement} layout="vertical">
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomPageLeaseAgreementInquiryDetail')}
                    </label>
                  </div>
                  <div className="col-span-12">
                    <FormFloatInput
                      label={t('EcomPageLeaseAgreementInquiryDeailName')}
                      name={['inquiryDetail', 'title']}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormFloatSelect
                      onChange={(projectId) => getListUnit(projectId)}
                      required
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t('EcomBannerManagementPageProject')}`,
                        },
                      ]}
                      label={t('EcomBannerManagementPageProject')}
                      name={['inquiryDetail', 'projectId']}
                      filterOption={true}
                      showSearch
                      options={projects?.map((x) => ({
                        value: x.id,
                        label: x.name,
                        id: x.id,
                        disabled: !x.isActive,
                      }))}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormFloatSelect
                      showSearch
                      onSearch={(keyword) =>
                        getListUnit(
                          formLeaseAgreement.getFieldValue(['inquiryDetail', 'projectId']),
                          keyword,
                          false,
                        )
                      }
                      required
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t('EcomBannerManagementPageUnit')}`,
                        },
                      ]}
                      label={t('EcomBannerManagementPageUnit')}
                      name={['inquiryDetail', 'unitId']}
                      filterOption={true}
                      options={[...listUnit]?.map((x) => ({
                        value: x.id,
                        label: x.unitNo,
                        id: x.id,
                        disabled: x?.status === 2,
                      }))}
                    />
                  </div>
                </div>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailContactDetail')}
                    </label>
                  </div>
                  <div className="col-span-4">
                    <FormFloatInput
                      rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                      name={['contactDetail', 'ownerName']}
                      label={t('EcomTicketManagementDetailPageDetailContactName')}
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
                      name={['contactDetail', 'phone']}
                      label={t('EcomTicketManagementDetailPageDetailContactPhone')}
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
                      name={['contactDetail', 'email']}
                      label={t('EcomTicketManagementDetailPageDetailContactEmai')}
                    />
                  </div>
                  <div className="col-span-12">
                    <FormFloatInput
                      rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                      name={['contactDetail', 'companyName']}
                      label={t('EcomTicketManagementDetailPageDetailContactCompany')}
                    />
                  </div>
                </div>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomTicketManagementDetailPageDetailLeaseExcecution')}
                    </label>
                  </div>
                  <div className="col-span-4">
                    <FormFloatInput
                      rules={[{ max: 100, message: `${error('maxlength')} 100` }]}
                      name={['leaseExecution', 'contractNumber']}
                      label={t('EcomTicketManagementDetailPageDetailContactNumber')}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormFloatSelect
                      required
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t('EcomTicketManagementDetailPageDetailLeaseAgreementStatus')}`,
                        },
                      ]}
                      label={t('EcomTicketManagementDetailPageDetailLeaseAgreementStatus')}
                      name={['leaseExecution', 'laStatus']}
                      filterOption={true}
                      options={LAStatus.map((x) => ({
                        value: x.id,
                        label: comm(x.name),
                        id: x.id,
                      }))}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={999999999}
                      name={['leaseExecution', 'remindBeforeDay']}
                      label={t('EcomTicketManagementDetailPageDetailRemindBeforeDay')}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatDate
                      disabledDate={disabledDateLAremindBeforeDay}
                      onChange={setValueForLeaseTerm}
                      name={['leaseExecution', 'laCommencementDate']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseCommencementDate')}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatDate
                      disabledDate={disabledDateLACommencementDate}
                      onChange={setValueForLeaseTerm}
                      name={['leaseExecution', 'laExpirationDate']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseExpirationDate')}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatInput
                      rules={[{ max: 250, message: `${error('maxlength')} 250` }]}
                      disabled
                      name={['leaseExecution', 'leaseTerm']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseTerm')}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      name={['leaseExecution', 'rentIncludeVAT']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseRent_InclVAT_VND')}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      name={['leaseExecution', 'rent']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseRentUSD')}
                    />
                  </div>
                  <div className="col-span-4"></div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      name={['leaseExecution', 'serviceChargeIncludeVAT']}
                      label={t(
                        'EcomTicketManagementDetailPageDetailLeaseServiceCharge_InclVAT_VND',
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      name={['leaseExecution', 'serviceCharge']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseServiceChargeUSD')}
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
                      <Select className="w-full" showSearch onSearch={getListStaff}>
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
                      {t('EcomTicketManagementDetailPageDetailPayment')}
                    </label>
                  </div>
                  <div className="col-span-4">
                    <FormFloatNumber
                      maxNum={99999999999}
                      name={['payment', 'depositAmount']}
                      label={t('EcomTicketManagementDetailPageDetailLeaseDepositAmiunt_VND')}
                    />
                  </div>
                  <div className="col-span-4">
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t(
                            'EcomTicketManagementDetailPageDetailPDepositStatus',
                          )}`,
                        },
                      ]}
                      name={['payment', 'depositStatus']}
                      label={t('EcomTicketManagementDetailPageDetailPDepositStatus')}
                    >
                      <Select className="w-full" showSearch>
                        {LADepositStatus.map((option, index) => (
                          <Option key={index} value={option.id}>
                            {comm(option.name)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-span-4">
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: `${error('pleaseSelect')} ${t(
                            'EcomTicketManagementDetailPageDetailPaymentTerm',
                          )}`,
                        },
                      ]}
                      name={['payment', 'paymentTerm']}
                      label={t('EcomTicketManagementDetailPageDetailPaymentTerm')}
                    >
                      <Select className="w-full" showSearch>
                        {LAPayment.map((option, index) => (
                          <Option key={index} value={option.id}>
                            {comm(option.name)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default LeaseAgreementDetail;
