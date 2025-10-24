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
import { PreviewMobileComponents } from './components/PreviewMobile';

const tabKeys = {
  tabVI: 'TAB_VI',
  tabEN: 'TAB_EN',
  tabKR: 'TAB_KR',
};

export interface Props {
  params: any;
}
const PrivacyPolicyPage: FC<Props> = ({ params }) => {
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
  const [isShowPreviewMobile, setIsShowPreviewMobile] = useState(false);
  const [languageShow, setLanguageShow] = useState('vi');

  const [dataTsAndCs, setDataTsAndCs] = useState<any>(null);

  const { userInfo } = useGlobalStore();
  const [formInfo] = Form.useForm();

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
        // mobile
        titleMobileVI: data.titleMobile.find((item) => item?.language === 'vi')?.value ?? null,
        titleMobileEN: data.titleMobile.find((item) => item?.language === 'en')?.value ?? null,
        titleMobileKR: data.titleMobile.find((item) => item?.language === 'kr')?.value ?? null,
        descriptionMobileVI:
          data.descriptionMobile.find((item) => item?.language === 'vi')?.value ?? null,
        descriptionMobileEN:
          data.descriptionMobile.find((item) => item?.language === 'en')?.value ?? null,
        descriptionMobileKR:
          data.descriptionMobile.find((item) => item?.language === 'kr')?.value ?? null,
      });
    }
  };

  const onSave = async () => {
    await formInfo.validateFields();
    const values = formInfo.getFieldsValue();
    const body = {
      title: dataTsAndCs?.title,
      description: dataTsAndCs?.description,
      titleMobile: [
        {
          language: 'vi',
          value: values?.titleMobileVI,
        },
        {
          language: 'en',
          value: values?.titleMobileEN,
        },
        {
          language: 'kr',
          value: values?.titleMobileKR,
        },
      ],
      descriptionMobile: [
        {
          language: 'vi',
          value: values?.descriptionMobileVI,
        },
        {
          language: 'en',
          value: values?.descriptionMobileEN,
        },
        {
          language: 'kr',
          value: values?.descriptionMobileKR,
        },
      ],
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
      titleMobile: [
        {
          language: 'vi',
          value: values?.titleMobileVI,
        },
        {
          language: 'en',
          value: values?.titleMobileEN,
        },
        {
          language: 'kr',
          value: values?.titleMobileKR,
        },
      ],
      descriptionMobile: [
        {
          language: 'vi',
          value: values?.descriptionMobileVI,
        },
        {
          language: 'en',
          value: values?.descriptionMobileEN,
        },
        {
          language: 'kr',
          value: values?.descriptionMobileKR,
        },
      ],
      isActive: true,
      type: TypeModuleEnum.RegulationOnSettlement,
    };
    setDataPreview(body);
    setLanguageShow(language);

    setIsShowPreviewMobile(true);
  };

  const onCancelPreview = () => {
    setIsShowPreviewMobile(false);
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
      <AppPageMeta title={`${t('EcomLeftMenuBarRegulationSettlementMobile')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-bold text-portal-primaryMainAdmin">
              {t('EcomLeftMenuBarRegulationSettlementMobile')}
            </h1>
          </div>
          <Form form={formInfo} layout="vertical">
            <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
              <TabPane tab={t(tabKeys.tabVI)} key={tabKeys.tabVI}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* MOBILE */}
                  <div className="col-span-12">
                    <FormFloatInput name="titleMobileVI" label={t('EcomPageTsAnhCsTitle')} />
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="descriptionMobileVI" label={t('EcomPageTsAnhCsDescription')}>
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
                      <span>{t('previewBeforeMobile')}</span>
                    </Button>
                  </div>
                  {/* END MOBILE */}
                </div>
              </TabPane>
              <TabPane tab={t(tabKeys.tabEN)} key={tabKeys.tabEN}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* MOBILE */}
                  <div className="col-span-12">
                    <FormFloatInput name="titleMobileEN" label={t('EcomPageTsAnhCsTitle')} />
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="descriptionMobileEN" label={t('EcomPageTsAnhCsDescription')}>
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
                      <span>{t('previewBeforeMobile')}</span>
                    </Button>
                  </div>
                  {/* END MOBILE */}
                </div>
              </TabPane>
              <TabPane tab={t(tabKeys.tabKR)} key={tabKeys.tabKR}>
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  {/* MOBILE */}
                  <div className="col-span-12">
                    <FormFloatInput name="titleMobileKR" label={t('EcomPageTsAnhCsTitle')} />
                  </div>
                  <div className="col-span-12">
                    <Form.Item name="descriptionMobileKR" label={t('EcomPageTsAnhCsDescription')}>
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
                      <span>{t('previewBeforeMobile')}</span>
                    </Button>
                  </div>
                  {/* END MOBILE */}
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </WrapPageScroll>

      <PreviewMobileComponents
        data={dataPreview}
        onCancel={onCancelPreview}
        isShow={isShowPreviewMobile}
        language={languageShow}
      />
    </>
  ) : (
    <WaringPermission />
  );
};

export default PrivacyPolicyPage;
