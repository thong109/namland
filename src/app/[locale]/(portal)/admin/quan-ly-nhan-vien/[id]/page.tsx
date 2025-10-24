'use client';
import roleApiService from '@/apiServices/externalApiServices/apiRoleService';
import staffApiService from '@/apiServices/externalApiServices/apiStaffService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatInputPassword from '@/components/FormInput/formInputPassword';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { appPermissions, emailRegex, phoneRegex, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Switch, Tabs } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabInfoStaff: 'AMENITY_TAB_INFO_STAFF',
};
const { TabPane } = Tabs;

const StaffDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const { userInfo } = useGlobalStore();
  const isAddNew = params.id === 'add-new' ? true : false;
  const { push, back } = useRouter();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const [staffInfoForm] = Form.useForm();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfoStaff);

  const [listRole, setListRole] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllRoles('');
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!isAddNew) {
      const staffDetail = await staffApiService.getById(params.id);

      staffInfoForm.setFieldsValue({
        ...staffDetail,
      });
    }
  };

  const getAllRoles = async (keyword: string) => {
    const filter = {
      from: 0,
      size: 15,
      isActive: true,
      keyword: keyword,
    };
    const staffsResponse: any = await roleApiService.getRolesInStaff(filter);
    setListRole(staffsResponse?.data);
  };

  const onSave = debounce(async () => {
    setIsLoading(true);
    try {
      await staffInfoForm.validateFields();
      const values = staffInfoForm.getFieldsValue();

      if (!isAddNew) {
        await staffApiService
          .updateStaff(
            {
              ...values,
              id: params.id,
            },
            null,
          )
          .then(() => push(`/admin/quan-ly-nhan-vien`));
        notify('success', success('updateAPI'));
      } else {
        try {
          const body = {
            ...values,
            isActive: true,
          };
          await staffApiService
            .createStaff({ ...body }, null)
            .then(() => push(`/admin/quan-ly-nhan-vien`));
        } catch (e) {
          notify('error', e.response?.data?.message ?? error('createAPI'));
        }
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, 400);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => back()} />

        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_staff.insert,
          appPermissions.portal_staff.update,
          appPermissions.portal_staff.admin,
        ]) &&
          selectedIndex === tabKeys.tabInfoStaff && (
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

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_staff.insert,
      appPermissions.portal_staff.update,
      appPermissions.portal_staff.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {isAddNew
              ? t('EcomBannerManagementPageCreateStaff')
              : t('EcomBannerManagementPageEditStaff')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t('EcomPropertyListingDetailPageStaffInfo')} key={tabKeys.tabInfoStaff}>
            <Form form={staffInfoForm} layout="vertical">
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-1">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomBannerManagementPageStaffInfoLogin')}
                  </label>
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    required
                    disabled={!isAddNew}
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateStaffuserName',
                        )}`,
                      },
                      { max: 250, message: `${error('maxlength')} 250` },
                    ]}
                    label={t('EcomBannerManagementPageCreateStaffuserName')}
                    name="userName"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateStaffFirstName',
                        )}`,
                      },
                      { max: 250, message: `${error('maxlength')} 250` },
                    ]}
                    label={t('EcomBannerManagementPageCreateStaffFirstName')}
                    name="firstName"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateStaffLastName',
                        )}`,
                      },
                      { max: 250, message: `${error('maxlength')} 250` },
                    ]}
                    label={t('EcomBannerManagementPageCreateStaffLastName')}
                    name="lastName"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    required
                    disabled={!isAddNew}
                    rules={[
                      { max: 15, message: `${error('maxlength')} 15` },
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t('EcomBannerManagementPageCreateStaffPhone')}`,
                      },
                      {
                        pattern: phoneRegex,
                        message: `${eForm('formatPhoneError')}`,
                      },
                    ]}
                    label={t('EcomBannerManagementPageCreateStaffPhone')}
                    name="phone"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t('EcomBannerManagementPageCreateStaffEmail')}`,
                      },
                      { min: 6, message: `${eForm('minLength')} 6` },
                      { max: 256, message: `${eForm('maxlength')} 256` },
                      {
                        pattern: emailRegex,
                        message: `${eForm('formatEmailError')}`,
                      },
                    ]}
                    label={t('EcomBannerManagementPageCreateStaffEmail')}
                    name="email"
                  />
                </div>
                {isAddNew && (
                  <div className="col-span-4">
                    <FormFloatInputPassword
                      required
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseInput')} ${t(
                            'EcomMemberPageListViewStaffPassword',
                          )}`,
                        },
                        { min: 6, message: `${eForm('minLength')} 6` },
                        { max: 256, message: `${eForm('maxlength')} 256` },
                      ]}
                      name="password"
                      label={t('EcomMemberPageListViewStaffPassword')}
                    />
                  </div>
                )}
                <div className="col-span-12">
                  <FormFloatInputArea
                    rules={[{ max: 5000, message: `${eForm('maxlength')} 5000` }]}
                    label={t('EcomBannerManagementPageCreateStaffDiscription')}
                    name="description"
                  />
                </div>
                {!isAddNew && (
                  <div className="col-span-12">
                    <Form.Item
                      label={t('EcomMemberPageListViewProjectStatus')}
                      valuePropName="checked"
                      name="isActive"
                      // rules={[
                      //   {  required: true,
                      //     message: `${eForm('pleaseInput')} ${t(
                      //       'EcomMemberPageListViewProjectStatus',
                      //     )}`,
                      //   },
                      // ]}
                    >
                      <Switch className="bg-[#b0b2b8]" />
                    </Form.Item>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-1">
                  <label className="font-bold">{t('EcomMemberPageListViewStaffRole')}</label>
                </div>
                <div className="col-span-4">
                  <FormFloatSelect
                    label={t('EcomMemberPageListViewStaffRole')}
                    required
                    name="accessGroupId"
                    showSearch={true}
                    onSearch={getAllRoles}
                    options={listRole.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
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

export default StaffDetailPage;
