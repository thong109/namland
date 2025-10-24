'use client';
import TsAndCsService from '@/apiServices/externalApiServices/apiTsAndCsService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatInput from '@/components/FormInput/formInput';
import SyncfutionRichText from '@/components/SyncfusionRichText';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { appPermissions, roleAdminGod, TypeModuleEnum } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Tabs } from 'antd';
import Form from 'antd/es/form';
import TabPane from 'antd/es/tabs/TabPane';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState, useTransition } from 'react';
import { toast, TypeOptions } from 'react-toastify';
import { PreviewTsAndCsWebComponents } from './components/PreviewTsAndCsWebComponents';

const tabKeys = {
  tabVI: 'TAB_VI',
  tabEN: 'TAB_EN',
  tabKR: 'TAB_KR',
};

export interface Props {
  params: any;
}
const PageRegulationOnSettlement: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabVI);
  const eForm = useTranslations('error');
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const [isPending, startTransition] = useTransition();
  const [dataPreview, setDataPreview] = useState<any>(null);
  const [isShowPreviewWeb, setIsShowPreviewWeb] = useState(false);
  const [languageShow, setLanguageShow] = useState('vi');

  const { userInfo } = useGlobalStore();
  const [formInfo] = Form.useForm();

  const [dataTsAndCs, setDataTsAndCs] = useState<any>(null);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const data = await TsAndCsService.getData({ type: TypeModuleEnum.RegulationOnSettlement });
    setDataTsAndCs(data);
    if (data === null) {
      formInfo.setFieldsValue({
        titleVI: null,
        titleEN: null,
        titleKR: null,
        descriptionVI: null,
        descriptionEN: null,
        descriptionKR: null,
      });
    } else {
      formInfo.setFieldsValue({
        // web
        titleVI: data.title.find((item) => item?.language === 'vi')?.value ?? null,
        titleEN: data.title.find((item) => item?.language === 'en')?.value ?? null,
        titleKR: data.title.find((item) => item?.language === 'kr')?.value ?? null,
        descriptionVI: data.description.find((item) => item?.language === 'vi')?.value ?? null,
        descriptionEN: data.description.find((item) => item?.language === 'en')?.value ?? null,
        descriptionKR: data.description.find((item) => item?.language === 'kr')?.value ?? null,
      });
    }
  };

  const onSave = async () => {
    await formInfo.validateFields();
    const values = formInfo.getFieldsValue();
    const body = {
      title: [
        {
          language: 'vi',
          value: values?.titleVI,
        },
        {
          language: 'en',
          value: values?.titleEN,
        },
        {
          language: 'kr',
          value: values?.titleKR,
        },
      ],
      description: [
        {
          language: 'vi',
          value: values?.descriptionVI,
        },
        {
          language: 'en',
          value: values?.descriptionEN,
        },
        {
          language: 'kr',
          value: values?.descriptionKR,
        },
      ],
      titleMobile: dataTsAndCs?.titleMobile,
      descriptionMobile: dataTsAndCs?.descriptionMobile,
      isActive: true,
      type: TypeModuleEnum.RegulationOnSettlement,
    };
    startTransition(async () => {
      try {
        await TsAndCsService.createOrUpdate(body);
        notify('success', success('createAPI'));
      } catch {
        notify('error', errorNoti('createAPI'));
      }
    });
  };

  const onPreview = async (language) => {
    await formInfo.validateFields();
    const values = formInfo.getFieldsValue();
    const body = {
      title: [
        {
          language: 'vi',
          value: values?.titleVI,
        },
        {
          language: 'en',
          value: values?.titleEN,
        },
        {
          language: 'kr',
          value: values?.titleKR,
        },
      ],
      description: [
        {
          language: 'vi',
          value: values?.descriptionVI,
        },
        {
          language: 'en',
          value: values?.descriptionEN,
        },
        {
          language: 'kr',
          value: values?.descriptionKR,
        },
      ],
      isActive: true,
      type: TypeModuleEnum.RegulationOnSettlement,
    };
    setDataPreview(body);
    setLanguageShow(language);

    setIsShowPreviewWeb(true);
  };

  const onCancelPreview = () => {
    setIsShowPreviewWeb(false);
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonPrimary isLoading={isPending} text={t('save')} onClick={onSave} />
      </div>
    );
  };
  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.portal_setting.view]) ? (
    <>
      <AppPageMeta title={`${t('EcomLeftMenuBarRegulationSettlement')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-bold text-portal-primaryMainAdmin">
              {t('EcomLeftMenuBarRegulationSettlement')}
            </h1>
          </div>
          <Form form={formInfo} layout="vertical">
            <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
              <TabPane tab={t(tabKeys.tabVI)} key={tabKeys.tabVI}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* WEB */}
                  <div className="col-span-12">
                    <FormFloatInput
                      name="titleVI"
                      label={t('EcomPageTsAnhCsTitle')}
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseInput')} ${t('EcomPageTsAnhCsTitle')}`,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-span-12">
                    <Form.Item
                      name="descriptionVI"
                      label={t('EcomPageTsAnhCsDescription')}
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseInput')} ${t('EcomPageTsAnhCsDescription')}`,
                        },
                      ]}
                    >
                      <SyncfutionRichText />
                    </Form.Item>
                  </div>
                  <div className="col-span-12">
                    <Button
                      className="text-sm"
                      size="large"
                      loading={isPending}
                      onClick={() => onPreview('vi')}
                    >
                      <span>{t('previewBeforeWeb')}</span>
                    </Button>
                  </div>
                  {/* END WEB */}
                </div>
              </TabPane>
              <TabPane tab={t(tabKeys.tabEN)} key={tabKeys.tabEN}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* WEB */}
                  <div className="col-span-12">
                    <FormFloatInput name="titleEN" label={t('EcomPageTsAnhCsTitle')} />
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="descriptionEN" label={t('EcomPageTsAnhCsDescription')}>
                      <SyncfutionRichText />
                    </Form.Item>
                  </div>
                  <div className="col-span-12">
                    <Button
                      className="text-sm"
                      size="large"
                      loading={isPending}
                      onClick={() => onPreview('en')}
                    >
                      <span>{t('previewBeforeWeb')}</span>
                    </Button>
                  </div>
                  {/* END WEB */}
                </div>
              </TabPane>
              <TabPane tab={t(tabKeys.tabKR)} key={tabKeys.tabKR}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* WEB */}
                  <div className="col-span-12">
                    <FormFloatInput name="titleKR" label={t('EcomPageTsAnhCsTitle')} />
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="descriptionKR" label={t('EcomPageTsAnhCsDescription')}>
                      <SyncfutionRichText />
                    </Form.Item>
                  </div>
                  <div className="col-span-12">
                    <Button
                      className="text-sm"
                      size="large"
                      loading={isPending}
                      onClick={() => onPreview('kr')}
                    >
                      <span>{t('previewBeforeWeb')}</span>
                    </Button>
                  </div>
                  {/* END WEB */}
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </WrapPageScroll>

      <PreviewTsAndCsWebComponents
        data={dataPreview}
        onCancel={onCancelPreview}
        isShow={isShowPreviewWeb}
        language={languageShow}
      />
    </>
  ) : (
    <WaringPermission />
  );
};

export default PageRegulationOnSettlement;
