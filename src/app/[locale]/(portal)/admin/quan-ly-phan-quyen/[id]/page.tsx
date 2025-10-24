'use client';
import roleApiService from '@/apiServices/externalApiServices/apiRoleService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Checkbox, Switch, Tabs } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabInfo: 'ROLE_TAB_INFO',
  tabPermission: 'ROLE_TAB_PERMISSION',
};
const { TabPane } = Tabs;

const RoleDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const { userInfo } = useGlobalStore();
  const idAddNew = params.id === 'add-new' ? true : false;
  const { push } = useRouter();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const tPermission = useTranslations('permission');
  const tPermissionParent = useTranslations('permissionParent');
  const [roleForm] = Form.useForm();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfo);
  const [listGroupPermission, setListGroupPermission] = useState<any[]>([]);
  const [listIsSelect, setIslistIsSelect] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!idAddNew) {
      const roleDetail = await roleApiService.getById(params.id);

      roleForm.setFieldsValue({
        ...roleDetail,
      });

      setIslistIsSelect([...roleDetail?.accesses]);
    } else {
      setIslistIsSelect([]);
    }
    groupPermission();
  };

  const groupPermission = () => {
    const groupPermission = Object.keys(appPermissions).map((key) => {
      return {
        name: key,
        permissions: Object.keys(appPermissions[key]).map((permissionKey) => {
          const permissionName = appPermissions[key][permissionKey];
          return {
            name: permissionName,
          };
        }),
      };
    });

    setListGroupPermission(groupPermission);
  };
  const selectOrDeselectPermissionChild = (permissionSelect) => {
    const selectPermission = [...listIsSelect];
    const index = selectPermission.indexOf(permissionSelect);

    if (index !== -1) {
      // If permissionSelect exists in selectPermission, remove it
      selectPermission.splice(index, 1);
    } else {
      // If permissionSelect doesn't exist in selectPermission, add it
      selectPermission.push(permissionSelect);
    }

    setIslistIsSelect(selectPermission);
  };

  const onSave = debounce(async () => {
    setIsLoading(true);
    try {
      await roleForm.validateFields();
      const values = roleForm.getFieldsValue();
      const body = { ...values, accesses: listIsSelect };

      if (!idAddNew) {
        try {
          await roleApiService
            .updateRole({ ...body, id: params.id })
            .then(() => push(`/admin/quan-ly-phan-quyen`));
          notify('success', success('updateAPI'));
        } catch {
          notify('error', error('updateAPI'));
        }
      } else {
        try {
          await roleApiService
            .createRole({ ...body })
            .then(() => push(`/admin/quan-ly-phan-quyen`));
          notify('success', success('updateAPI'));
        } catch {
          notify('error', error('updateAPI'));
        }
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }, 300);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push(`/admin/quan-ly-phan-quyen`)} />
        {(idAddNew || !idAddNew) &&
          checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_roles.insert,
            appPermissions.portal_roles.update,
            appPermissions.portal_roles.admin,
          ]) && (
            <ButtonPrimary text={t('save')} onClick={onSave} className="ml-1 rounded-full px-6" />
          )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_roles.view,
      appPermissions.portal_roles.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="flex w-full justify-between">
          <div className="mb-5 text-xl font-semibold">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {idAddNew
                ? t('EcomBannerManagementPageCreateRole')
                : t('EcomBannerManagementPageEditRole')}
            </h1>
          </div>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabInfo)} key={tabKeys.tabInfo}>
            <Form form={roleForm} className="bg-white" layout="vertical">
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomBannerManagementPageRoleInfo')}
                  </label>
                </div>
                <div className="col-span-12">
                  <Form.Item
                    name="isActive"
                    label={t('EcomBannerManagementPageDetailIsActive')}
                    valuePropName="checked"
                  >
                    <Switch className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
                <div className="col-span-6">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t('EcomPageDetailRoleName')}`,
                      },
                      { max: 250, message: `${error('maxlength')} 250` },
                    ]}
                    label={t('EcomPageDetailRoleName')}
                    name="name"
                  />
                </div>
                <div className="col-span-6">
                  <FormFloatInputArea
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t('EcomPageDetailRoleNote')}`,
                      },
                      { max: 500, message: `${error('maxlength')} 500` },
                    ]}
                    label={t('EcomPageDetailRoleNote')}
                    name="note"
                  />
                </div>
              </div>
            </Form>
          </TabPane>
          <TabPane tab={t(tabKeys.tabPermission)} key={tabKeys.tabPermission}>
            <div className="h-full">
              {listGroupPermission.map((groupPermission, index) => (
                <div className="mb-1 bg-white p-2" key={index}>
                  <div className="mb-2 text-sm font-bold">
                    {tPermissionParent(groupPermission.name)}
                  </div>
                  <Checkbox.Group className="w-full" value={listIsSelect}>
                    <div className="grid w-full grid-cols-12 gap-3">
                      {groupPermission.permissions.map((permission, childIndex) => (
                        <div className="col-span-3" key={childIndex}>
                          <Checkbox
                            value={permission.name}
                            onChange={(checkedValues) =>
                              selectOrDeselectPermissionChild(checkedValues.target.value)
                            }
                            className="text-truncate"
                          >
                            {tPermission(permission.name)}
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </Checkbox.Group>
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default RoleDetailPage;
