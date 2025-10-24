'use client';
import SettingApiService from '@/apiServices/externalApiServices/apiSettingService';
import AppPageMeta from '@/components/AppPageMeta';
import FormTagInputShap from '@/components/FormInput/FormTagInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import UploadLogo from '@/components/uploadLogo/UploadLogo';
import { appPermissions, dataType, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion, convertJsonSetting } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form, Switch } from 'antd';
import Input from 'antd/es/input/Input';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

type KeyValuePair<T> = {
  key: keyof T;
  valueData: T[keyof T];
};
const SettingPage: FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const [settingForm] = Form.useForm();
  const [setting, setSetting] = useState<any>(undefined);
  const [logoImage, setLogoImage] = useState<File>(undefined);
  const [logoLandingpage, setLogoLandindPage] = useState<File>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userInfo } = useGlobalStore();
  const [listUserNotify, setListUserNotify] = useState<any[]>([]);
  useEffect(() => {
    getSetting();
  }, []);

  const GetAutoCompleteEmail = async (keyword: string) => {
    let listEmail = [] as any;
    const reponse = await SettingApiService.getAutoComplete(keyword);
    listEmail = reponse?.data ?? [];
    setListUserNotify(listEmail);
  };

  const getSetting = async () => {
    const data = await SettingApiService.getListSetting();
    const dataConvert = convertJsonSetting(data.data);
    dataConvert.NOTIFICATION_INFO = dataConvert.NOTIFICATION_INFO.map(function (item) {
      return item?.email;
    });

    setSetting(dataConvert);

    settingForm.setFieldsValue({ ...dataConvert });
  };

  const onChangeLogoProperty = async (value) => {
    if (logoImage || (!logoImage && setting.LOGO_IMAGE.Image)) {
      const userArray: KeyValuePair<any>[] = Object.entries(setting).map(([key, valueData]) => ({
        key: key as keyof any,
        valueData,
      }));
      const index = userArray.findIndex((item) => item.key === 'LOGO_IMAGE');
      if (logoImage) {
        if (index > -1) {
          userArray.splice(index, 1, {
            key: 'LOGO_IMAGE',
            valueData: { IsActive: value, Image: '' },
          });
        }
      } else {
        if (index > -1) {
          userArray.splice(index, 1, {
            key: 'LOGO_IMAGE',
            valueData: {
              Image: setting?.LOGO_IMAGE.Image,
              IsActive: value,
            },
          });
        }
      }

      try {
        await SettingApiService.updateSetting(userArray, logoImage, undefined).then(() =>
          getSetting(),
        );

        notify('success', success('updateAPI'));
        setLogoImage(undefined);
      } catch {
        settingForm.setFieldValue(['LOGO_IMAGE', 'IsActive'], !value);
        notify('error', errorNoti('updateAPI'));
      }
    } else {
      console.log('');
    }
  };

  const onSave = async () => {
    await settingForm.validateFields();
    const values = settingForm.getFieldsValue();

    const userArray: KeyValuePair<any>[] = Object.entries(values).map(([key, valueData]) => ({
      key: key as keyof any,
      valueData,
    }));

    if (logoImage) {
      const index = userArray.findIndex((item) => item.key === 'LOGO_IMAGE');

      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'LOGO_IMAGE',
          valueData: { IsActive: values?.LOGO_IMAGE.IsActive, Image: '' },
        });
      }
    } else {
      const index = userArray.findIndex((item) => item.key === 'LOGO_IMAGE');

      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'LOGO_IMAGE',
          valueData: {
            Image: setting?.LOGO_IMAGE.Image,
            IsActive: values?.LOGO_IMAGE.IsActive,
          },
        });
      }
    }

    if (logoLandingpage) {
      userArray.push({ key: 'LOGO_LANDING_PAGE', valueData: undefined });
    } else {
      userArray.push({
        key: 'LOGO_LANDING_PAGE',
        valueData: setting?.LOGO_LANDING_PAGE,
      });
    }
    try {
      setIsLoading(true);

      await SettingApiService.updateSetting(userArray, logoImage, logoLandingpage).then(() =>
        getSetting(),
      );

      setIsLoading(false);
      setLogoImage(undefined);
      setLogoLandindPage(undefined);
      notify('success', success('updateAPI'));
    } catch {
      setIsLoading(false);
      setLogoImage(undefined);
      setLogoLandindPage(undefined);

      notify('error', errorNoti('updateAPI'));
    }
  };

  const onChangeZoneBanner = async (value) => {
    const userArray: KeyValuePair<any>[] = Object.entries(setting).map(([key, valueData]) => ({
      key: key as keyof any,
      valueData,
    }));
    const index = userArray.findIndex((item) => item.key === 'ZONE_LOGO_BANNER');
    try {
      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'ZONE_LOGO_BANNER',
          valueData: value,
        });
      }
      await SettingApiService.updateSetting(userArray).then(() => getSetting());

      notify('success', success('updateAPI'));
    } catch {
      settingForm.setFieldValue('ZONE_LOGO_BANNER', !value);
      notify('error', errorNoti('updateAPI'));
    }
  };

  const onChangeZoneAgency = async (value) => {
    const userArray: KeyValuePair<any>[] = Object.entries(setting).map(([key, valueData]) => ({
      key: key as keyof any,
      valueData,
    }));
    const index = userArray.findIndex((item) => item.key === 'ZONE_AGENCY');
    try {
      setIsLoading(true);
      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'ZONE_AGENCY',
          valueData: value,
        });
      }
      const data = await SettingApiService.updateSetting(userArray).then(() => getSetting());
      notify('success', success('updateAPI'));

      setIsLoading(false);
    } catch {
      setIsLoading(false);
      settingForm.setFieldValue('ZONE_AGENCY', !value);
      notify('error', errorNoti('updateAPI'));
    }
  };

  const onChangeZoneAgencyDetail = async (value) => {
    const userArray: KeyValuePair<any>[] = Object.entries(setting).map(([key, valueData]) => ({
      key: key as keyof any,
      valueData,
    }));
    const index = userArray.findIndex((item) => item.key === 'ZONE_REVIEW_AGENCY');
    try {
      setIsLoading(true);
      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'ZONE_REVIEW_AGENCY',
          valueData: value,
        });
      }
      await SettingApiService.updateSetting(userArray).then(() => getSetting());
      notify('success', success('updateAPI'));

      setIsLoading(false);
    } catch {
      setIsLoading(false);
      settingForm.setFieldValue('ZONE_REVIEW_AGENCY', !value);
      notify('error', errorNoti('updateAPI'));
    }
  };

  const onChangeZoneComment = async (value) => {
    const userArray: KeyValuePair<any>[] = Object.entries(setting).map(([key, valueData]) => ({
      key: key as keyof any,
      valueData,
    }));
    const index = userArray.findIndex((item) => item.key === 'ZONE_REVIEW');
    try {
      setIsLoading(true);
      if (index > -1) {
        userArray.splice(index, 1, {
          key: 'ZONE_REVIEW',
          valueData: value,
        });
      }
      const data = await SettingApiService.updateSetting(userArray).then(() => getSetting());
      notify('success', success('updateAPI'));

      setIsLoading(false);
    } catch {
      setIsLoading(false);
      settingForm.setFieldValue('ZONE_REVIEW', !value);
      notify('error', errorNoti('updateAPI'));
    }
  };

  const renderActions = () => {
    return (
      <>
        <div className="flex w-full flex-col justify-end p-3 lg:flex-row">
          <Button
            size="large"
            className="mb[-10px] ml-1 border-x border-y border-portal-blackGray bg-portal-primaryMainAdmin px-10 py-3 !text-white"
            onClick={() =>
              checkPermissonAcion(userInfo?.accesses, [
                roleAdminGod,
                appPermissions.portal_setting.view,
                appPermissions.portal_setting.admin,
              ])
                ? onSave()
                : undefined
            }
            loading={isLoading}
          >
            {t('save')}
          </Button>
        </div>
      </>
    );
  };
  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_setting.view,
    appPermissions.portal_setting.update,
    appPermissions.portal_setting.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarSetting')} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="h-full w-full bg-portal-backgroud px-3 md:px-[40px] lg:px-[50px]">
          <div className="align-items-center mt-[57px] flex justify-between">
            <h1 className="tile-marker mb-5 text-xl font-semibold">
              {t('EcomLeftMenuBarSetting')}
            </h1>
          </div>

          <Form layout="vertical" form={settingForm}>
            <div className="grid grid-cols-12 gap-3">
              {/* Logo in images */}
              <div className="col-span-6 mb-2 grid grid-cols-6 gap-4 bg-white p-4 pt-[15px]">
                <div className="col-span-full flex">
                  <span className="font-bold">{t('EcomStaffSettingZoneImageInImageProperty')}</span>
                </div>
                <div className="col-span-full flex items-center">
                  <Form.Item name={['LOGO_IMAGE', 'IsActive']} valuePropName="checked">
                    <Switch
                      disabled={isLoading}
                      className="mr-2 bg-[#b0b2b8]"
                      onChange={onChangeLogoProperty}
                    />
                  </Form.Item>
                  <label>{t('EcomStaffSettingImageInImageProperty')}</label>
                </div>
                <div className="col-span-full flex min-h-[120px]">
                  <UploadLogo
                    urlInit={setting?.LOGO_IMAGE.Image}
                    onChange={(value) => setLogoImage(value)}
                    uploadButtonLabel={t('EcomCreateAPropertyPageDetailUploadFiles')}
                  />
                </div>
              </div>

              {/* Logo in Langding Pagee */}
              <div className="col-span-6 mb-2 grid grid-cols-6 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-full flex">
                  <span className="font-bold">
                    {t('EcomStaffSettingZoneImageInImageLandingPage')}
                  </span>
                </div>
                <div className="col-span-full flex min-h-[120px]">
                  <UploadLogo
                    urlInit={setting?.LOGO_LANDING_PAGE}
                    onChange={(value) => setLogoLandindPage(value)}
                    uploadButtonLabel={t('EcomCreateAPropertyPageDetailUploadFiles')}
                  />
                </div>
              </div>

              {/* Config show zone landing page*/}
              <div className="col-span-12 mb-2 grid grid-cols-12 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-12 flex">
                  <span className="font-bold">{t('EcomStaffSettingZoneConfig')}</span>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_LOGO_BANNER"
                    label={t('EcomStaffSettingZoneBanner')}
                    valuePropName="checked"
                  >
                    <Switch
                      disabled={isLoading}
                      className="mr-2 bg-[#b0b2b8]"
                      onChange={onChangeZoneBanner}
                    />
                  </Form.Item>
                </div>

                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_REVIEW"
                    label={t('EcomSettingZoneReview')}
                    valuePropName="checked"
                  >
                    <Switch
                      disabled={isLoading}
                      className="mr-2 bg-[#b0b2b8]"
                      onChange={onChangeZoneComment}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_AGENCY"
                    label={t('EcomAgencyZoneReview')}
                    valuePropName="checked"
                  >
                    <Switch
                      disabled={isLoading}
                      className="mr-2 bg-[#b0b2b8]"
                      onChange={onChangeZoneAgency}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_REVIEW_AGENCY"
                    label={t('EcomAgencyDetailSettingZoneReview')}
                    valuePropName="checked"
                  >
                    <Switch
                      disabled={isLoading}
                      className="mr-2 bg-[#b0b2b8]"
                      onChange={onChangeZoneAgencyDetail}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name={['MOBILE_VERSION', 'version']}
                    label={t('EcomAgencyDetailSettingMobileVersion')}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name={['MOBILE_VERSION', 'isForce']}
                    label={t('EcomAgencyDetailSettingMobileIsForce')}
                    valuePropName="checked"
                  >
                    <Switch disabled={isLoading} className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_TOP_UP"
                    label={t('EcomAgencyDetailSettingAllowTopup')}
                    valuePropName="checked"
                  >
                    <Switch disabled={isLoading} className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_REGISTER"
                    label={t('EcomAgencyDetailSettingZoneRegister')}
                    valuePropName="checked"
                  >
                    <Switch disabled={isLoading} className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
                <div className="col-span-3">
                  <Form.Item
                    name="ZONE_DISABLE_LOGIN"
                    label={t('EcomAgencyDetailSettingZoneBlockLogin')}
                    valuePropName="checked"
                  >
                    <Switch disabled={isLoading} className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
              </div>

              {/* Config show zone landing page*/}
              <div className="col-span-6 mb-2 grid grid-cols-6 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-full mb-3 flex">
                  <span className="font-bold">{t('EcomStaffSettingSuggetedRadius')}</span>
                </div>
                <div className="col-span-full">
                  <FormFloatNumber
                    maxNum={500}
                    name="SUGGESTED_RADIUS"
                    label={t('EcomStaffSettingSuggetedRadius')}
                  />
                </div>
              </div>
              <div className="col-span-6 mb-2 grid grid-cols-6 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-full mb-3 flex">
                  <span className="font-bold">{t('EcomStaffSettingMaxNumberOfPublishDate')}</span>
                </div>
                <div className="col-span-full">
                  <FormFloatNumber
                    maxNum={500}
                    name="MAX_NUMBER_OF_PUBLISH_DAYS"
                    label={t('EcomStaffSettingMaxNumberOfPublishDate')}
                  />
                </div>
              </div>
              <div className="col-span-12 mb-2 grid grid-cols-6 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-full flex">
                  <span className="font-bold">{t('EcomStaffSettingEmailContact')}</span>
                </div>
                <div className="col-span-full">
                  <label className="text-base font-medium">
                    {t('EcomStaffSettingEmailContact')}
                  </label>
                  <FormTagInputShap name="EMAIL_CONTACT" type={dataType.email} />
                </div>
              </div>

              <div className="col-span-12 mb-2 grid grid-cols-6 gap-3 bg-white p-4 pt-[15px]">
                <div className="col-span-full flex">
                  <span className="font-bold">{t('EcomStaffSettingNotifyInfo')}</span>
                </div>
                <div className="col-span-full flex">
                  <span className="mb-2 text-xs">{t('EcomStaffSettingNotifyNote')}</span>
                </div>
                <div className="col-span-full">
                  <FormFloatSelect
                    showSearch
                    onSearch={GetAutoCompleteEmail}
                    label={t('EcomStaffSettingNotifyTitle')}
                    multiSelect
                    name="NOTIFICATION_INFO"
                    options={listUserNotify.map((x) => ({
                      value: x,
                      label: x,
                      id: x,
                    }))}
                  />
                </div>
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

export default SettingPage;
