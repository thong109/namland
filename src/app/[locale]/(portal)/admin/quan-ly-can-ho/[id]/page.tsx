'use client';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import MultiLanguageTextArea from '@/components/FormInput/MultiLanguageInput';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { appPermissions, listStatusUnit, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkPermissonAcion,
  checkTextMultiLanguageInBlackListForForm,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabOverView: 'TAB_OVER_VIEW',
};
const { TabPane } = Tabs;

const UnitDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [unitInfoForm] = Form.useForm();
  const [selectedIndex, setSelectedIndex] = useState(tabKeys.tabOverView);
  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const idAddNew = params.id === 'add-new' ? true : false;
  const { push } = useRouter();
  const t = useTranslations('webLabel');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');

  const [unitDetail, setUnitDetail] = useState<any>(undefined);
  const [projects, setProjects] = useState<any[]>([]);
  const [views, setViews] = useState<any[]>([]);
  const [propertyTypes, setPropertyType] = useState<any[]>([]);

  useEffect(() => {
    getListProject();
    getviewUnit();
    getPropertyTypes();
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!idAddNew) {
      const unitDetail = await unitApiInAdmin.getById(params.id);
      setUnitDetail(unitDetail);
      await unitInfoForm.setFieldsValue({
        ...unitDetail,
      });
    } else {
      await unitInfoForm.resetFields();

      unitInfoForm.setFieldValue('status', 1); //init Status 1 = active
    }
  };

  const getListProject = async () => {
    const res = await projectApiService.getLookupProjects();

    setProjects(res.data);
  };

  const getviewUnit = async () => {
    const res = await propertyApiService.getPropertyViews();
    setViews(res.data);
  };

  const getPropertyTypes = async () => {
    const res = await propertyApiService.getPropertyTypes();
    setPropertyType(res.data);
  };

  const onSave = debounce(async () => {
    await unitInfoForm.validateFields();
    const values = unitInfoForm.getFieldsValue();
    try {
      if (idAddNew) {
        const body = {
          ...values,
          description: values.description.filter((item) => item.value?.length > 0),
        };
        await unitApiInAdmin.createUnit(body);
        notify('success', success('createAPI'));
      } else {
        const body = {
          ...unitDetail,
          ...values,
          description: values.description.filter((item) => item.value?.length > 0),
          id: params.id,
        };
        await unitApiInAdmin.updateUnit(body);
        notify('success', success('updateAPI'));
      }
      push(`/admin/quan-ly-du-an?tabActive=TAB_UNIT`);
    } catch (e) {
      notify('error', e.response?.data?.message);
    }
  }, 400);

  const changTabSelect = (tabkey) => {
    setSelectedIndex(tabkey);
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack
          text={t('goBack')}
          onClick={() => push(`/admin/quan-ly-du-an?tabActive=TAB_UNIT`)}
        />
        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_unit.update,
          appPermissions.portal_unit.insert,
          appPermissions.portal_unit.admin,
        ]) && (
          <ButtonPrimary text={t('save')} onClick={onSave} className="ml-1 rounded-full px-6" />
        )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_unit.view,
      appPermissions.portal_unit.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {idAddNew
              ? t('EcomBannerManagementPageCreateUnit')
              : t('EcomBannerManagementPageEditUnit')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabOverView)} key={tabKeys.tabOverView}>
            <Form form={unitInfoForm} layout="vertical" size="middle">
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomBannerManagementPageUnitInfo')}
                  </label>
                </div>

                <div className="col-span-4">
                  <FormFloatSelect
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseSelect')} ${t('EcomBannerManagementPageProject')}`,
                      },
                    ]}
                    label={t('EcomBannerManagementPageProject')}
                    name="projectId"
                    filterOption={true}
                    options={projects?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatSelect
                    label={t('EcomBannerManagementPageUnitType')}
                    name="typeId"
                    filterOption={true}
                    options={propertyTypes?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    label={t('EcomBannerManagementPageUnitNo')}
                    name="unitNo"
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t('EcomBannerManagementPageUnitNo')}`,
                      },
                      { max: 250, message: `${eForm('maxlength')} 250` },
                    ]}
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={9999999}
                    label={t('EcomBannerManagementPageUnitArea')}
                    name="area"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                    label={t('EcomBannerManagementPageFloor')}
                    name="floor"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatSelect
                    label={comm('View')}
                    name="viewId"
                    filterOption={true}
                    options={views?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={99999999999}
                    label={t('EcomBannerManagementPageCreateProjecMonthlyFee')}
                    name="unitMothlyMgtFee"
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatDate
                    label={t('EcomBannerManagementPageCreateProjetYearBuild')}
                    name="unitYearBuild"
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={99999999}
                    label={t('EcomBannerManagementPageCreateProjetOutdoorSpace')}
                    name="unitOutdoorSpace"
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatSelect
                    label={t('EcomBannerManagementPageUnitStatus')}
                    name="status"
                    filterOption={true}
                    options={listStatusUnit?.map((x) => ({
                      value: x.id,
                      label: comm(x.name),
                      id: x.id,
                    }))}
                  />
                </div>
                <div className="col-span-12">
                  <label>
                    {t('EcomPropertyListingDetailPageContactInformationUnitDescription')}
                  </label>

                  <Form.Item
                    name="description"
                    label=""
                    rules={[
                      {
                        max: 5000,
                        validator: (rule, value) =>
                          checkMultiLanguageMaxLength(rule, value, `${eForm('maxlength')} 5000`),
                      },

                      {
                        validator: (rule, value) =>
                          checkTextMultiLanguageInBlackListForForm(
                            value,
                            keyword,
                            `${eForm('keywordInBlackList')}`,
                          ),
                      },
                    ]}
                    initialValue={[
                      { language: 'vi', value: '' },
                      { language: 'en', value: '' },
                      { language: 'ko', value: '' },
                    ]}
                  >
                    <MultiLanguageTextArea maxLength={5001} row={5} />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default UnitDetailPage;
